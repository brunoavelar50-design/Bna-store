const products = [
 {id:1,name:"Camiseta BNA Essential",cat:"Roupas",price:59.90,old:79.90,emoji:"👕",tag:"OFERTA"},
 {id:2,name:"Camiseta Oversized BNA",cat:"Roupas",price:69.90,old:89.90,emoji:"👕",tag:"OFERTA"},
 {id:3,name:"Tênis Street Classic",cat:"Tênis",price:149.90,old:199.90,emoji:"👟",tag:"MAIS VENDIDO"},
 {id:4,name:"Tênis Urban Black",cat:"Tênis",price:169.90,old:219.90,emoji:"👟",tag:"OFERTA"},
 {id:5,name:"Boné BNA Logo",cat:"Bonés",price:49.90,old:69.90,emoji:"🧢",tag:""},
 {id:6,name:"Boné Classic",cat:"Bonés",price:44.90,old:59.90,emoji:"🧢",tag:"OFERTA"},
 {id:7,name:"Chinelo Street",cat:"Chinelos",price:39.90,old:49.90,emoji:"🩴",tag:""},
 {id:8,name:"Chinelo BNA Essential",cat:"Chinelos",price:34.90,old:44.90,emoji:"🩴",tag:"OFERTA"},
 {id:9,name:"Agasalho BNA Classic",cat:"Agasalhos",price:119.90,old:159.90,emoji:"🧥",tag:"OFERTA"},
 {id:10,name:"Moletom BNA Oversized",cat:"Agasalhos",price:109.90,old:149.90,emoji:"🧥",tag:""},
 {id:11,name:"Corta-Vento Urban",cat:"Agasalhos",price:129.90,old:179.90,emoji:"🧥",tag:"NOVO"},
 {id:12,name:"Camiseta Basic Premium",cat:"Roupas",price:64.90,old:84.90,emoji:"👕",tag:""}
];

let category="Todos", cart=JSON.parse(localStorage.getItem("bnaCart")||"[]");

const money=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const grid=document.getElementById("productGrid");

function render(list=products){
  let arr=list.filter(p=>category==="Todos"||p.cat===category);
  const q=document.getElementById("searchInput").value.toLowerCase();
  if(q) arr=arr.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q));
  const sort=document.getElementById("sortSelect").value;
  if(sort==="low") arr.sort((a,b)=>a.price-b.price);
  if(sort==="high") arr.sort((a,b)=>b.price-a.price);
  grid.innerHTML=arr.length?arr.map(p=>`
    <article class="product" onclick="openProduct(${p.id})">
      <div class="product-image"><span class="emoji">${p.emoji}</span>${p.tag?`<span class="tag">${p.tag}</span>`:""}<button class="quick" onclick="event.stopPropagation();addToCart(${p.id})">ADICIONAR AO CARRINHO</button></div>
      <h3>${p.name}</h3><div><span class="old">${money(p.old)}</span><span class="price">${money(p.price)}</span></div>
    </article>`).join(""):"<p>Nenhum produto encontrado.</p>";
}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});save();openCart();}
function save(){localStorage.setItem("bnaCart",JSON.stringify(cart));updateCart();}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div class="thumb">${x.emoji}</div><div><h4>${x.name}</h4><p>${x.qty} × ${money(x.price)}</p></div><button onclick="removeItem(${x.id})">×</button></div>`).join(""):'<p class="empty">Seu carrinho está vazio.</p>';
 document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("open")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
function openProduct(id){
 const p=products.find(x=>x.id===id);
 document.getElementById("modalContent").innerHTML=`<div class="modal-product"><div class="big-img">${p.emoji}</div><div><p class="eyebrow">${p.cat}</p><h2>${p.name}</h2><p class="desc">Produto demonstrativo da BNA Store. Aqui você poderá colocar a descrição real, informações de tamanho, material e disponibilidade.</p><div class="modal-price"><span class="old">${money(p.old)}</span> ${money(p.price)}</div><div><b>Tamanho</b><div class="size"><button class="selected">P</button><button>M</button><button>G</button><button>GG</button></div></div><button class="primary modal-add" onclick="addToCart(${p.id});closeModal()">ADICIONAR AO CARRINHO</button></div></div>`;
 document.getElementById("productModal").classList.add("open");document.getElementById("overlay").classList.add("open");
}
function closeModal(){document.getElementById("productModal").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");category=b.dataset.category;render()});
document.getElementById("sortSelect").onchange=()=>render();
document.getElementById("searchInput").oninput=()=>render();
document.getElementById("searchBtn").onclick=()=>document.getElementById("searchbar").classList.toggle("open");
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=()=>{closeCart();closeModal()};
document.getElementById("modalClose").onclick=closeModal;
document.getElementById("menuBtn").onclick=()=>document.getElementById("mobileMenu").classList.toggle("open");
updateCart();render();
