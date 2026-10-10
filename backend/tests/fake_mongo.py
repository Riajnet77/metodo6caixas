"""Minimal atomic Mongo operations for customer-access regression tests."""
import copy
import re
import uuid
from types import SimpleNamespace
from pymongo.errors import DuplicateKeyError
MISSING = object()
def field(doc, key):
    value = doc
    for part in key.split('.'):
        if not isinstance(value, dict) or part not in value: return MISSING
        value = value[part]
    return value

def matches(doc, query):
    for key, expected in query.items():
        if key == '$or':
            if not any(matches(doc, q) for q in expected): return False
            continue
        actual = field(doc, key)
        if isinstance(expected, dict):
            for op, val in expected.items():
                if op == '$exists' and (actual is not MISSING) != val: return False
                if op == '$gt' and (actual is MISSING or actual <= val): return False
                if op == '$lt' and (actual is MISSING or actual >= val): return False
                if op == '$ne' and actual == val: return False
                if op == '$regex' and (actual is MISSING or re.search(val, str(actual), re.I if expected.get('$options')=='i' else 0) is None): return False
        elif actual is MISSING or actual != expected: return False
    return True

def apply(doc, update, inserted=False):
    for key, val in update.get('$set', {}).items(): doc[key] = copy.deepcopy(val)
    for key, val in update.get('$inc', {}).items(): doc[key] = doc.get(key, 0) + val
    if inserted:
        for key, val in update.get('$setOnInsert', {}).items(): doc[key] = copy.deepcopy(val)

class Collection:
    def __init__(self): self.docs = []
    async def find_one(self, query, projection=None):
        return next((copy.deepcopy(d) for d in self.docs if matches(d, query)), None)
    async def insert_one(self, document):
        doc = copy.deepcopy(document);doc.setdefault('_id', str(uuid.uuid4()))
        if any(d['_id'] == doc['_id'] for d in self.docs): raise DuplicateKeyError('duplicate')
        self.docs.append(doc);return SimpleNamespace(inserted_id=doc['_id'])
    async def update_one(self, query, update, upsert=False):
        for doc in self.docs:
            if matches(doc, query):
                apply(doc, update);return SimpleNamespace(matched_count=1)
        if upsert:
            doc = {k:v for k,v in query.items() if not k.startswith('$') and not isinstance(v,dict)}
            apply(doc,update,True);await self.insert_one(doc)
        return SimpleNamespace(matched_count=0)
    async def find_one_and_update(self, query, update, return_document=None):
        for doc in self.docs:
            if matches(doc, query):
                apply(doc,update);return copy.deepcopy(doc)
        return None

class DB:
    def __init__(self):
        self.users=Collection();self.hotmart_purchases=Collection();self.password_reset_tokens=Collection()
