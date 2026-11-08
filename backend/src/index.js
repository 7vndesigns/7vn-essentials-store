// 7VN Essentials API foundation. No live supplier, payments or fulfillment until verified.
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...extra}});
const cors=(req,env)=>{const origin=req.headers.get('Origin');return origin&&origin===env.STORE_ORIGIN?{'access-control-allow-origin':origin,'vary':'Origin'}:{}};
const adapterFor=env=>{
 switch(env.SUPPLIER_ADAPTER){
 case 'unconfigured':return {name:'unconfigured',async catalog(){return []},async quote(){throw Error('Supplier not configured')},async submit(){throw Error('Supplier not configured')},async track(){throw Error('Supplier not configured')}};
 default:throw Error('Unsupported supplier adapter');
 }
};
export default {
 async fetch(request,env){
 const url=new URL(request.url),path=url.pathname.replace(/\/$/,'')||'/';
 const headers=cors(request,env);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'access-control-allow-methods':'GET,OPTIONS','access-control-allow-headers':'content-type'}});
 if(request.method==='GET'&&path==='/health')return json({ok:true,service:'7vn-essentials-api',supplier:env.SUPPLIER_ADAPTER||'unconfigured',checkoutEnabled:false},200,headers);
 if(request.method==='GET'&&path==='/api/catalog'){
 try{
 const result=await env.DB.prepare('SELECT id,name,case_description,retail_price_cents,currency,available,stock_quantity,verified_at FROM catalog ORDER BY name').all();
 return json({ok:true,products:result.results.map(p=>({...p,available:!!p.available})),source:'verified_supplier_catalog',checkoutEnabled:false},200,headers);
 }catch{return json({ok:false,error:'Catalog temporarily unavailable',products:[]},503,headers)}
 }
 if(request.method==='GET'&&path==='/api/store-status')return json({ok:true,supplierConnected:env.SUPPLIER_ADAPTER!=='unconfigured',checkoutEnabled:false,ordersEnabled:false},200,headers);
 if(path==='/api/checkout'||path==='/api/orders'||path==='/api/sync')return json({ok:false,error:'Not enabled. Supplier, payment and fulfillment verification required.'},403,headers);
 return json({ok:false,error:'Not found'},404,headers);
 },
 async scheduled(_event,env){
 // Reserved for future verified supplier catalog sync; intentionally no writes.
 adapterFor(env);
 }
};
