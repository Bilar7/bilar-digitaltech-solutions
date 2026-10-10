import React,{useState} from 'react';
import {Edit3,Mail,Plus,ShieldCheck,Trash2,UserRoundX} from 'lucide-react';
import {AdminRole,AdminUser} from '../types';

type AdminAccountsProps={data:any};
type AdminConfirmState={title:string;description:string;confirmLabel?:string;cancelLabel?:string;onConfirm:()=>void;onCancel?:()=>void};
let setGlobalAdminConfirm:(state:AdminConfirmState|null)=>void=()=>{};
const requestAdminConfirm=(title:string,description:string,onConfirm:()=>void,onCancel?:()=>void)=>{setGlobalAdminConfirm({title,description,confirmLabel:'Confirmar',cancelLabel:'Cancelar',onConfirm,onCancel});};
const AdminConfirmDialog=({title,description,confirmLabel='Confirmar',cancelLabel='Cancelar',onConfirm,onCancel}:{title:string;description:string;confirmLabel?:string;cancelLabel?:string;onConfirm:()=>void;onCancel?:()=>void})=><div className="admin-modal-backdrop"><div className="admin-modal"><div className="admin-modal-head"><div><div className="admin-eyebrow">CONFIRMAÇÃO</div><h2>{title}</h2></div><button type="button" onClick={onCancel||(()=>{})} aria-label="Fechar">×</button></div><p>{description}</p><div className="form-actions"><button type="button" className="admin-secondary" onClick={onCancel||(()=>{})}>{cancelLabel}</button><button type="button" className="admin-primary" onClick={onConfirm}>{confirmLabel}</button></div></div></div>;

export default function AdminAccounts({data}:AdminAccountsProps){
 const[editing,setEditing]=useState<AdminUser|null>(null);
 const[error,setError]=useState('');
 const[busy,setBusy]=useState(false);
 const[credentials,setCredentials]=useState<any>(null);
 const[create,setCreate]=useState(false);
 const[name,setName]=useState('');
 const[email,setEmail]=useState('');
 const[role,setRole]=useState<AdminRole>('Editor');
 const[salaryText,setSalaryText]=useState('');
 const[salaryCurrency,setSalaryCurrency]=useState('MZN');
 const[confirmState,setConfirmState]=useState<AdminConfirmState|null>(null);
 React.useEffect(()=>{setGlobalAdminConfirm=setConfirmState; return ()=>{setGlobalAdminConfirm=()=>{}};},[]);

 const closeCreate=()=>{setCreate(false);setName('');setEmail('');setRole('Editor');setError('');};
 const createAccount=async()=>{
   setError('');
   if(!name.trim()||!email.trim()){setError('Preencha nome e email.');return;}
   setBusy(true);
   try{const result=await data.createAdminAccess(name,email,role);setCredentials({...result,name:name.trim()});closeCreate();}
   catch(problem:any){setError(problem?.message||'Não foi possível criar o utilizador.');}
   finally{setBusy(false);}
 };
 const saveAccount=async()=>{
   if(!editing)return;
   setError('');
   if(!editing.name.trim()){setError('O nome é obrigatório.');return;}
   setBusy(true);
  const salary=salaryText.trim();
   try{
     await data.updateAdminUser(editing.id,{
       name:editing.name.trim(),
       role:editing.role,
       active:editing.active,
       salary:salary?Number(salary):null,
      salaryCurrency:salary?salaryCurrency:null
     });
     setEditing(null);
   }catch(problem:any){setError(problem?.message||'Não foi possível guardar as alterações.');}
   finally{setBusy(false);}
 };
 const editAccount=(user:AdminUser)=>{setSalaryText(user.salary==null?'':String(user.salary));setSalaryCurrency(user.salaryCurrency||'MZN');setEditing(user);};
 const removeAccount=async(user:AdminUser)=>{
   requestAdminConfirm('Remover acesso?',`Tem a certeza que pretende remover o acesso de ${user.name}? A conta Firebase continuará sem perfil autorizado para entrar.`, async()=>{
     setError('');
     try{await data.deleteAdminUser(user.id);}
     catch(problem:any){setError(problem?.message||'Não foi possível remover o acesso.');}
   });
 };
 const shareCredentials=async()=>{
   if(!credentials)return;
   const text=`Bilar DigitalTech Solutions\n\nACESSO À GESTÃO BILAR\nNome: ${credentials.name}\nEmail: ${credentials.email}\nFunção: ${credentials.role}\nPalavra-passe temporária: ${credentials.tempPassword}\n\nEntre em ${credentials.inviteUrl}, confirme o email e altere a palavra-passe no primeiro acesso.`;
   if(navigator.share){try{await navigator.share({title:'Acesso — Gestão Bilar',text,url:credentials.inviteUrl});return;}catch{}}
   await navigator.clipboard?.writeText(text);
   alert('Credenciais copiadas. Envie-as ao colaborador por um canal privado.');
 };
 const accountRole=(value:AdminRole)=>value==='Editor'?'Editor / Designer':value;
 const recoverAccount=async(user:AdminUser)=>{
   setError('');
   setBusy(true);
   try{const result=await data.resendAdminCredentials(user.id);alert(`Foi enviado um email de recuperação para ${result.email}.`);}
   catch(problem:any){setError(problem?.message||'Não foi possível enviar a recuperação.');}
   finally{setBusy(false);}
 };

 return <>
   <section className="admin-panel table-panel">
     <div className="panel-head"><div><div className="admin-eyebrow">CONTAS</div><h3>Contas autorizadas</h3></div><div className="form-actions"><span className="admin-pill green">{data.adminUsers.length} contas</span><button className="admin-primary" onClick={()=>{setError('');setCreate(true);}}><Plus size={15}/> Criar utilizador</button></div></div>
     {error&&<div className="admin-error">{error}</div>}
     {data.adminUsers.length?<div className="admin-table-scroll"><table><thead><tr><th>Nome</th><th>Email</th><th>Função</th><th>Estado</th><th>Vencimento</th><th>Acções</th></tr></thead><tbody>
       {data.adminUsers.map((user:AdminUser)=><tr key={user.id}>
         <td><strong>{user.name}</strong></td>
         <td>{user.username||user.email}</td>
         <td><span className="admin-pill blue">{accountRole(user.role)}</span></td>
         <td><span className={`admin-pill ${user.active?'green':'gray'}`}>{user.active?'Activo':'Suspenso'}</span></td>
         <td>{user.salary==null?'—':new Intl.NumberFormat('pt-PT',{style:'currency',currency:user.salaryCurrency||'MZN'}).format(user.salary)}</td>
         <td><div className="card-actions"><button onClick={()=>editAccount(user)}><Edit3 size={14}/> Editar</button><button onClick={()=>void recoverAccount(user)} disabled={busy}><Mail size={14}/> Recuperar acesso</button><button onClick={()=>void removeAccount(user)} className="danger-text"><Trash2 size={14}/> Remover acesso</button></div></td>
       </tr>)}
     </tbody></table></div>:<div className="admin-empty"><ShieldCheck size={24}/><h3>Sem contas para apresentar</h3><p>As contas autorizadas serão listadas aqui.</p></div>}
   </section>
   {create&&<div className="admin-modal-backdrop"><div className="admin-modal"><div className="admin-modal-head"><div><div className="admin-eyebrow">ACESSOS</div><h2>Criar utilizador</h2></div><button onClick={closeCreate} aria-label="Fechar">×</button></div>
     <p>A senha temporária é forte, inclui a referência BDS e exige alteração no primeiro acesso. O colaborador também precisa de confirmar o email.</p>
     <div className="form-grid"><label className="admin-field"><span>Nome completo</span><input value={name} onChange={event=>setName(event.target.value)} placeholder="Nome do colaborador"/></label><label className="admin-field"><span>Email profissional</span><input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="nome@empresa.com"/></label></div>
    <label className="admin-field"><span>Função</span><select value={role} onChange={event=>setRole(event.target.value as AdminRole)}><option value="Admin">Admin</option><option value="Editor">Editor / Designer</option><option value="Team Manager">Team Manager</option><option value="Marketing">Marketing</option></select></label>
    {role==='Marketing'&&<p>Marketing pode gerir links sociais públicos e rascunhos de campanhas. A publicação direta será activada depois da integração das APIs.</p>}
     {error&&<div className="admin-error">{error}</div>}
     <div className="form-actions"><button className="admin-primary" onClick={()=>void createAccount()} disabled={busy}><Plus size={15}/>{busy?'A criar...':'Criar conta'}</button></div>
   </div></div>}
   {editing&&<div className="admin-modal-backdrop"><div className="admin-modal"><div className="admin-modal-head"><div><div className="admin-eyebrow">CONTAS</div><h2>Editar acesso</h2></div><button onClick={()=>{setEditing(null);setError('');}} aria-label="Fechar">×</button></div>
     <div className="form-grid"><label className="admin-field"><span>Nome completo</span><input value={editing.name} onChange={event=>setEditing({...editing,name:event.target.value})}/></label><label className="admin-field"><span>Email de acesso</span><input value={editing.username||editing.email||''} readOnly/></label></div>
    <label className="admin-field"><span>Função</span><select value={editing.role} onChange={event=>setEditing({...editing,role:event.target.value as AdminRole})}><option value="Super Admin">Super Admin</option><option value="Admin">Admin</option><option value="Editor">Editor / Designer</option><option value="Team Manager">Team Manager</option><option value="Marketing">Marketing</option></select></label>
    {editing.role==='Marketing'&&<p>Marketing pode gerir links sociais públicos e rascunhos de campanhas. A publicação direta será activada depois da integração das APIs.</p>}
    <label className="admin-field"><span>Vencimento mensal (opcional)</span><div className="form-grid"><input aria-label="Valor do vencimento" type="number" min="0" step="0.01" value={salaryText} onChange={event=>setSalaryText(event.target.value)}/><select value={salaryCurrency} onChange={event=>setSalaryCurrency(event.target.value)}><option value="MZN">MZN</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div></label>
     <label className="check"><input type="checkbox" checked={editing.active} onChange={event=>setEditing({...editing,active:event.target.checked})}/>{editing.active?'Conta activa':'Conta suspensa'}</label>
     <p><UserRoundX size={15}/> Suspender bloqueia o acesso sem apagar o registo; remover elimina apenas a autorização de gestão.</p>
     {error&&<div className="admin-error">{error}</div>}
     <div className="form-actions"><button className="admin-primary" onClick={()=>void saveAccount()} disabled={busy}><Edit3 size={15}/>{busy?'A guardar...':'Guardar alterações'}</button><button className="admin-secondary" onClick={()=>void removeAccount(editing)}><Trash2 size={15}/> Remover acesso</button></div>
   </div></div>}
   {confirmState&&<AdminConfirmDialog title={confirmState.title} description={confirmState.description} confirmLabel={confirmState.confirmLabel} cancelLabel={confirmState.cancelLabel} onConfirm={()=>{confirmState.onConfirm();setConfirmState(null);}} onCancel={()=>{confirmState.onCancel?.();setConfirmState(null);}}/>}
   {credentials&&<div className="admin-modal-backdrop"><div className="admin-modal"><div className="admin-modal-head"><div><div className="admin-eyebrow">ACESSOS</div><h2>Conta criada</h2></div><button onClick={()=>setCredentials(null)} aria-label="Fechar">×</button></div><p>Guarde a senha temporária agora. Ela não será mostrada novamente.</p><div className="credential-box"><span>Nome</span><strong>{credentials.name}</strong><span>Email</span><strong>{credentials.email}</strong><span>Função</span><strong>{accountRole(credentials.role)}</strong><span>Senha temporária</span><strong>{credentials.tempPassword}</strong></div><div className="form-actions"><button className="admin-primary" onClick={()=>void shareCredentials()}><Mail size={15}/> Partilhar credenciais</button><button className="admin-secondary" onClick={()=>setCredentials(null)}>Fechar</button></div></div></div>}
 </>;
}
