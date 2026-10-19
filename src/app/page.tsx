"use client";

import { useMemo, useState } from "react";

type Status = "Entregue" | "Em trânsito" | "Pendente" | "Atrasada";
type Entrega = { numero: string; cliente: string; destino: string; modal: string; status: Status; prazo: string };
type Aba = "Visão geral" | "Entregas" | "Rastreamento" | "Clientes" | "SAC" | "Performance";

const base: Entrega[] = [
  { numero: "CAP-1001", cliente: "Aurora Farma", destino: "São Paulo, SP", modal: "Rodoviário", status: "Entregue", prazo: "19/10" },
  { numero: "CAP-1002", cliente: "NovaTech", destino: "Campinas, SP", modal: "Rodoviário", status: "Em trânsito", prazo: "20/10" },
  { numero: "CAP-1003", cliente: "Vitta Saúde", destino: "Curitiba, PR", modal: "Aéreo", status: "Atrasada", prazo: "18/10" },
  { numero: "CAP-1004", cliente: "Atlas Peças", destino: "Belo Horizonte, MG", modal: "Rodoviário", status: "Pendente", prazo: "22/10" },
  { numero: "CAP-1005", cliente: "Aurora Farma", destino: "Rio de Janeiro, RJ", modal: "Aéreo", status: "Entregue", prazo: "18/10" },
  { numero: "CAP-1006", cliente: "NovaTech", destino: "Recife, PE", modal: "Aéreo", status: "Em trânsito", prazo: "21/10" },
  { numero: "CAP-1007", cliente: "Vitta Saúde", destino: "Santos, SP", modal: "Rodoviário", status: "Entregue", prazo: "19/10" },
  { numero: "CAP-1008", cliente: "Atlas Peças", destino: "Porto Alegre, RS", modal: "Rodoviário", status: "Atrasada", prazo: "17/10" },
  { numero: "CAP-1009", cliente: "Aurora Farma", destino: "Manaus, AM", modal: "Aéreo", status: "Pendente", prazo: "24/10" },
  { numero: "CAP-1010", cliente: "NovaTech", destino: "Goiânia, GO", modal: "Rodoviário", status: "Entregue", prazo: "19/10" },
  { numero: "CAP-1011", cliente: "Vitta Saúde", destino: "Fortaleza, CE", modal: "Aéreo", status: "Em trânsito", prazo: "22/10" },
  { numero: "CAP-1012", cliente: "Atlas Peças", destino: "Florianópolis, SC", modal: "Rodoviário", status: "Entregue", prazo: "18/10" },
];
const abas: { nome: Aba; icone: string }[] = [
  { nome: "Visão geral", icone: "▦" }, { nome: "Entregas", icone: "▤" },
  { nome: "Rastreamento", icone: "◎" }, { nome: "Clientes", icone: "♧" },
  { nome: "SAC", icone: "☏" }, { nome: "Performance", icone: "◫" },
];
const historico = [
  { mes: "Mai", total: 82 }, { mes: "Jun", total: 91 }, { mes: "Jul", total: 86 },
  { mes: "Ago", total: 97 }, { mes: "Set", total: 89 }, { mes: "Out", total: 100 },
];
const clientes = [
  { nome: "Aurora Farma", entregas: 3480, margem: 28.4, pontualidade: 97 },
  { nome: "NovaTech", entregas: 2915, margem: 23.6, pontualidade: 94 },
  { nome: "Vitta Saúde", entregas: 2680, margem: 18.9, pontualidade: 91 },
  { nome: "Atlas Peças", entregas: 2205, margem: 15.2, pontualidade: 89 },
];
const setores = [
  { nome: "Operacional", indice: 96, detalhe: "Eficiência de expedição" },
  { nome: "SAC", indice: 91, detalhe: "Tratativas no prazo" },
  { nome: "Comercial", indice: 88, detalhe: "Retenção de carteira" },
];
const moeda = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function Tag({ status }: { status: Status }) {
  return <span className={"tag tag-" + status.replace(" ", "-").toLowerCase()}>{status}</span>;
}
function Cartao({ rotulo, valor, observacao, tom = "azul" }: { rotulo: string; valor: string; observacao: string; tom?: string }) {
  return <div className="kpi"><div className="kpi-label">{rotulo}</div><div className={"kpi-value " + tom}>{valor}</div><div className="kpi-note">{observacao}</div></div>;
}

export default function Home() {
  const [aba, setAba] = useState<Aba>("Visão geral");
  const [entregas, setEntregas] = useState<Entrega[]>(base);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("Todos");
  const [numeroRastreio, setNumeroRastreio] = useState("CAP-1002");
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const filtradas = useMemo(() => entregas.filter((e) => {
    const termo = (e.numero + " " + e.cliente + " " + e.destino).toLowerCase();
    return termo.includes(busca.toLowerCase()) && (statusFiltro === "Todos" || e.status === statusFiltro);
  }), [entregas, busca, statusFiltro]);
  const rastreada = entregas.find((e) => e.numero.toUpperCase() === numeroRastreio.trim().toUpperCase());
  const qtde = (status: Status) => entregas.filter((e) => e.status === status).length;
  const atualiza = (numero: string, status: Status) => setEntregas((anterior) => anterior.map((e) => e.numero === numero ? { ...e, status } : e));

  return (
    <div className="app-shell">
      <aside className={"sidebar " + (menuAberto ? "show" : "")}>
        <div className="brand"><span className="brand-mark">C</span><span><strong>CapiLog</strong><small>INTELIGÊNCIA LOGÍSTICA</small></span></div>
        <div className="side-label">PLATAFORMA</div>
        <nav className="nav">{abas.map(({ nome, icone }) => <button key={nome} onClick={() => { setAba(nome); setMenuAberto(false); }} className={aba === nome ? "selected" : ""}><span className="nav-icon">{icone}</span>{nome}</button>)}</nav>
        <div className="sidebar-bottom"><span className="pulse-dot"/> Ambiente de demonstração<small>100% dados simulados</small></div>
      </aside>
      <div className="main-wrap">
        <header className="topbar"><button className="menu-button" onClick={() => setMenuAberto(!menuAberto)} aria-label="Abrir menu">☰</button><div className="breadcrumbs">CapiLog <span>/</span> <b>{aba}</b></div><div className="top-right"><span className="demo-chip">● DEMO INTERATIVA</span><span className="avatar">CL</span></div></header>
        <main className="content">
          <div className="page-head"><div><div className="eyebrow">PAINEL DE CONTROLE</div><h1>{aba}</h1><p>{aba === "Visão geral" ? "Visibilidade inteligente para sua operação logística." : "Explore os dados simulados e as funcionalidades do CapiLog."}</p></div><button className="outline" onClick={() => { setEntregas(base); setBusca(""); setStatusFiltro("Todos"); }}>↻ Reiniciar demo</button></div>
          {aba === "Visão geral" && <>
            <div className="kpi-grid"><Cartao rotulo="Entregas no mês" valor="12.480" observacao="↗ +8,2% em relação ao mês anterior"/><Cartao rotulo="Entregas no prazo" valor="95,0%" observacao="↗ +2,1 pontos percentuais" tom="verde"/><Cartao rotulo="Cargas em trânsito" valor="438" observacao="Rodoviário e aéreo" tom="azul"/><Cartao rotulo="Ocorrências abertas" valor="124" observacao="↘ -12% no último mês" tom="laranja"/></div>
            <div className="two-col"><section className="panel"><div className="panel-title"><div><h2>Volume de entregas</h2><p>Evolução mensal simulada</p></div><span className="pill">Últimos 6 meses</span></div><div className="bars">{historico.map((h) => <div className="bar-col" key={h.mes}><span className="bar-value">{Math.round(h.total * 124.8).toLocaleString("pt-BR")}</span><div className="bar" style={{ height: h.total + "%" }}/><span>{h.mes}</span></div>)}</div></section><section className="panel"><div className="panel-title"><div><h2>Eficiência por setor</h2><p>Indicadores de desempenho</p></div></div><div className="progress-list">{setores.map((s) => <div key={s.nome}><div className="progress-top"><b>{s.nome}</b><strong>{s.indice}%</strong></div><div className="track"><div style={{width:s.indice+"%"}}/></div><small>{s.detalhe}</small></div>)}</div></section></div>
            <section className="panel"><div className="panel-title"><div><h2>Últimas movimentações</h2><p>Amostra de cargas da operação simulada</p></div><button className="text-link" onClick={() => setAba("Entregas")}>Ver todas →</button></div><Tabela entregas={entregas.slice(0,5)} editavel={false} atualiza={atualiza}/></section>
          </>}
          {aba === "Entregas" && <><div className="kpi-grid compact"><Cartao rotulo="Cargas de exemplo" valor={String(entregas.length)} observacao="Nesta simulação"/><Cartao rotulo="Entregues" valor={String(qtde("Entregue"))} observacao="Cargas concluídas" tom="verde"/><Cartao rotulo="Em trânsito" valor={String(qtde("Em trânsito"))} observacao="Em movimentação"/><Cartao rotulo="Atrasadas" valor={String(qtde("Atrasada"))} observacao="Exigem atenção" tom="laranja"/></div><section className="panel"><div className="panel-title"><div><h2>Controle de entregas</h2><p>Pesquise e altere o status para experimentar</p></div><button className="primary" onClick={()=>setModalAberto(true)}>+ Nova entrega fictícia</button></div><div className="filters"><input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar número, cliente ou destino..." aria-label="Pesquisar entregas"/><select value={statusFiltro} onChange={e=>setStatusFiltro(e.target.value)} aria-label="Filtrar por status"><option>Todos</option><option>Entregue</option><option>Em trânsito</option><option>Pendente</option><option>Atrasada</option></select></div><Tabela entregas={filtradas} editavel atualiza={atualiza}/></section></>}
          {aba === "Rastreamento" && <section className="panel tracking-panel"><div className="panel-title"><div><h2>Rastreamento de cargas</h2><p>Experimente com CAP-1001 até CAP-1012</p></div></div><div className="filters"><input value={numeroRastreio} onChange={e=>setNumeroRastreio(e.target.value)} placeholder="Digite CAP-1002" aria-label="Número da carga"/></div>{rastreada ? <div className="tracking-result"><div className="tracking-header"><div><span className="eyebrow">CARGA LOCALIZADA</span><h2>{rastreada.numero}</h2><p>{rastreada.cliente} · {rastreada.destino}</p></div><Tag status={rastreada.status}/></div><div className="timeline"><div><span className="timeline-dot done"/><strong>Pedido registrado</strong><small>Solicitação recebida no sistema</small></div><div><span className="timeline-dot done"/><strong>Coleta confirmada</strong><small>Mercadoria encaminhada para expedição</small></div><div><span className={"timeline-dot " + (rastreada.status === "Pendente" ? "" : "done")}/><strong>Em transporte</strong><small>Movimentação conforme modal {rastreada.modal.toLowerCase()}</small></div><div><span className={"timeline-dot " + (rastreada.status === "Entregue" ? "done" : "")}/><strong>Entrega concluída</strong><small>{rastreada.status === "Entregue" ? "Recebimento confirmado" : "Aguardando finalização"}</small></div></div><p className="sim-note">Linha do tempo demonstrativa, sem rastreamento real.</p></div> : <div className="empty">Nenhuma carga encontrada. Tente CAP-1002.</div>}</section>}
          {aba === "Clientes" && <><div className="kpi-grid compact"><Cartao rotulo="Clientes ativos" valor="48" observacao="Carteira simulada"/><Cartao rotulo="Receita mensal" valor="R$ 842 mil" observacao="Valores fictícios" tom="verde"/><Cartao rotulo="Margem média" valor="21,8%" observacao="Estimativa simulada"/><Cartao rotulo="Ticket por entrega" valor="R$ 67" observacao="Média demonstrativa"/></div><section className="panel"><div className="panel-title"><div><h2>Rentabilidade por cliente</h2><p>Cenário financeiro ilustrativo</p></div></div><div className="table-scroller"><table><thead><tr><th>Cliente</th><th>Entregas/mês</th><th>Margem</th><th>Receita simulada</th><th>Pontualidade</th></tr></thead><tbody>{clientes.map(c=><tr key={c.nome}><td><b>{c.nome}</b></td><td>{c.entregas.toLocaleString("pt-BR")}</td><td><strong className="green-text">{c.margem.toLocaleString("pt-BR")}%</strong></td><td>{moeda(c.entregas * 67)}</td><td>{c.pontualidade}%</td></tr>)}</tbody></table></div></section></>}
          {aba === "SAC" && <><div className="kpi-grid compact"><Cartao rotulo="Chamados abertos" valor="124" observacao="Simulação mensal" tom="laranja"/><Cartao rotulo="Resolvidos no prazo" valor="91%" observacao="Meta de 90%" tom="verde"/><Cartao rotulo="Tempo médio" valor="2,4 h" observacao="Primeira resposta"/><Cartao rotulo="Satisfação" valor="4,7/5" observacao="Pesquisa fictícia"/></div><section className="panel"><div className="panel-title"><div><h2>Tipos de ocorrência</h2><p>Motivos mais frequentes na operação simulada</p></div></div><div className="progress-list">{[{nome:"Atraso na entrega",indice:42,detalhe:"52 ocorrências"},{nome:"Falha de endereço",indice:27,detalhe:"33 ocorrências"},{nome:"Avaria e extravio",indice:18,detalhe:"22 ocorrências"},{nome:"Outros",indice:13,detalhe:"17 ocorrências"}].map(i=><div key={i.nome}><div className="progress-top"><b>{i.nome}</b><strong>{i.indice}%</strong></div><div className="track"><div style={{width:i.indice+"%"}}/></div><small>{i.detalhe}</small></div>)}</div></section></>}
          {aba === "Performance" && <><div className="kpi-grid compact"><Cartao rotulo="OTIF simulado" valor="93,6%" observacao="Entregas no prazo e completas" tom="verde"/><Cartao rotulo="Reentregas" valor="2,8%" observacao="Taxa mensal" tom="laranja"/><Cartao rotulo="Produtividade" valor="+12%" observacao="Evolução simulada"/><Cartao rotulo="Custo por entrega" valor="R$ 43" observacao="Média estimada"/></div><section className="panel"><div className="panel-title"><div><h2>Performance por setor</h2><p>Indicadores comparativos ilustrativos</p></div></div><div className="progress-list">{setores.map(s=><div key={s.nome}><div className="progress-top"><b>{s.nome}</b><strong>{s.indice}%</strong></div><div className="track"><div style={{width:s.indice+"%"}}/></div><small>{s.detalhe}</small></div>)}</div></section></>}
          <footer>© CapiLog Demo · Apresentação ilustrativa com dados inteiramente fictícios · Nenhum dado é salvo em banco</footer>
        </main>
      </div>
      {modalAberto && <div className="modal-backdrop" onClick={()=>setModalAberto(false)}><div className="modal" onClick={e=>e.stopPropagation()}><div className="panel-title"><div><h2>Nova entrega fictícia</h2><p>Cadastro apenas nesta sessão</p></div><button className="close" onClick={()=>setModalAberto(false)} aria-label="Fechar">×</button></div><form onSubmit={e=>{e.preventDefault();const form=new FormData(e.currentTarget);const numero=String(form.get("numero")||"").trim().toUpperCase();if(entregas.some(x=>x.numero===numero)){alert("Esse número já existe na demonstração.");return;}setEntregas(atual=>[{numero,cliente:String(form.get("cliente")),destino:String(form.get("destino")),modal:"Rodoviário",status:"Pendente",prazo:"A definir"},...atual]);setModalAberto(false);}}><label>Número da carga<input name="numero" placeholder="CAP-1013" required maxLength={30}/></label><label>Cliente<input name="cliente" placeholder="Nome fictício" required maxLength={80}/></label><label>Destino<input name="destino" placeholder="Cidade, UF" required maxLength={80}/></label><div className="modal-actions"><button type="button" className="outline" onClick={()=>setModalAberto(false)}>Cancelar</button><button type="submit" className="primary">Adicionar à simulação</button></div></form></div></div>}
    </div>
  );
}

function Tabela({entregas, editavel, atualiza}: {entregas:Entrega[]; editavel:boolean; atualiza:(n:string,s:Status)=>void}) {
  return <div className="table-scroller"><table><thead><tr><th>Carga</th><th>Cliente</th><th>Destino</th><th>Modal</th><th>Prazo</th><th>Status</th></tr></thead><tbody>{entregas.map(e=><tr key={e.numero}><td className="cargo-id">{e.numero}</td><td><b>{e.cliente}</b></td><td>{e.destino}</td><td>{e.modal}</td><td>{e.prazo}</td><td>{editavel?<select className="status-select" aria-label={"Alterar status da carga "+e.numero} value={e.status} onChange={event=>atualiza(e.numero,event.target.value as Status)}><option>Entregue</option><option>Em trânsito</option><option>Pendente</option><option>Atrasada</option></select>:<Tag status={e.status}/>}</td></tr>)}</tbody></table>{entregas.length===0&&<div className="empty">Nenhuma entrega encontrada.</div>}</div>;
}
