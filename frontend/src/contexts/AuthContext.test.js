import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { AuthProvider, useAuth, authError } from './AuthContext';
jest.mock('axios',()=>({get:jest.fn(),post:jest.fn(),defaults:{headers:{common:{}}}}));
let root, container, context;
function Probe(){context=useAuth();return <span>{context.sessionError || context.user?.email || 'Sem sessão'}</span>;}
beforeEach(()=>{global.IS_REACT_ACT_ENVIRONMENT=true;localStorage.clear();jest.clearAllMocks();container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);});
afterEach(()=>{act(()=>root.unmount());container.remove();});
test('credential errors differ from network, unavailable and blocked access',()=>{
  expect(authError({response:{status:401}})).toContain('Esqueci minha senha');
  expect(authError({response:{status:503,data:{detail:'internal'}}})).toContain('temporariamente indisponível');
  expect(authError({})).toContain('iniciando');
  expect(authError({response:{status:403,data:{detail:'Compra revogada'}}})).toBe('Compra revogada');
  expect(authError({response:{status:422,data:{detail:[{}]}}})).toContain('Confira os dados');
});
test('transient server failure preserves token and offers retry',async()=>{
  localStorage.setItem('token','saved-token');localStorage.setItem('token_expiry',String(Date.now()+3600000));
  axios.get.mockRejectedValueOnce({response:{status:503}});
  await act(async()=>{root.render(<AuthProvider><Probe/></AuthProvider>);});
  expect(localStorage.getItem('token')).toBe('saved-token');expect(context.isAuthenticated).toBe(false);expect(context.sessionError).toContain('temporariamente indisponível');
  axios.get.mockResolvedValueOnce({data:{id:'a',email:'buyer@example.com'}});
  await act(async()=>{context.retrySession();});
  expect(context.isAuthenticated).toBe(true);expect(context.sessionError).toBe('');
});
test('revoked session is cleared on 401',async()=>{
  localStorage.setItem('token','expired-version');localStorage.setItem('token_expiry',String(Date.now()+3600000));axios.get.mockRejectedValue({response:{status:401}});
  await act(async()=>{root.render(<AuthProvider><Probe/></AuthProvider>);});expect(localStorage.getItem('token')).toBeNull();expect(context.isAuthenticated).toBe(false);
});
test('login preserves password exactly and authenticates only after me succeeds',async()=>{
  await act(async()=>{root.render(<AuthProvider><Probe/></AuthProvider>);});
  axios.post.mockResolvedValue({data:{access_token:'new-token'}});axios.get.mockResolvedValue({data:{id:'a',email:'buyer@example.com'}});
  let result;await act(async()=>{result=await context.login(' BUYER@example.com ',' secret password ');});
  expect(result.success).toBe(true);expect(axios.post.mock.calls[0][1].get('password')).toBe(' secret password ');expect(axios.post.mock.calls[0][1].get('username')).toBe('buyer@example.com');expect(context.isAuthenticated).toBe(true);
});
