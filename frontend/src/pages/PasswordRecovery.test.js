import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
import axios from 'axios';
import {useAuth} from '../contexts/AuthContext';
import PasswordRecovery from './PasswordRecovery';
jest.mock('axios',()=>({post:jest.fn()}));
jest.mock('../contexts/AuthContext',()=>({useAuth:jest.fn()}));
jest.mock('../contexts/AccessContext',()=>({SupportLink:()=>null}));
jest.mock('react-router-dom',()=>{
  global.TextEncoder=require('util').TextEncoder;global.TextDecoder=require('util').TextDecoder;
  return require('../../node_modules/react-router/dist/development/index.js');
});
let root,container,logout;
beforeEach(()=>{global.IS_REACT_ACT_ENVIRONMENT=true;window.history.replaceState(null,'','/');jest.clearAllMocks();logout=jest.fn();useAuth.mockReturnValue({logout});container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);});
afterEach(()=>{act(()=>root.unmount());container.remove();});
async function render(reset=false){await act(async()=>{root.render(<MemoryRouter><PasswordRecovery reset={reset}/></MemoryRouter>);});}
function enter(input,value){act(()=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));});}
async function submit(){await act(async()=>{container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});}
test('reset token is read from fragment and removed from address',async()=>{
  window.history.replaceState(null,'','/redefinir-senha#token='+'x'.repeat(43));await render(true);
  expect(window.location.hash).toBe('');expect(container.textContent).toContain('Definir nova senha');expect(container.querySelector('form')).not.toBeNull();
});
test('incomplete reset link cannot submit',async()=>{
  await render(true);expect(container.textContent).toContain('Este link está incompleto');expect(container.querySelector('form')).toBeNull();
});
test('forgot-password does not falsely confirm failed delivery',async()=>{
  await render();enter(container.querySelector('input'),'buyer@example.com');axios.post.mockRejectedValue({response:{status:503}});await submit();
  expect(container.querySelector('[role="alert"]').textContent).toContain('Não foi possível enviar');expect(container.querySelector('[role="status"]')).toBeNull();
});
test('successful reset submits captured token and logs out current browser',async()=>{
  const token='x'.repeat(43);window.history.replaceState(null,'','/redefinir-senha#token='+token);await render(true);
  const inputs=container.querySelectorAll('input');enter(inputs[0],'new-password');enter(inputs[1],'new-password');axios.post.mockResolvedValue({data:{message:'Senha atualizada'}});await submit();
  expect(axios.post.mock.calls[0][1]).toEqual({token,password:'new-password'});expect(logout).toHaveBeenCalled();expect(container.textContent).toContain('Senha atualizada');
});
