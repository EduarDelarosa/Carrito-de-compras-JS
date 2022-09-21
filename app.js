const d = document;
const $cards = d.getElementById('cards');
const $items = d.getElementById('items');
const $footer = d.getElementById('footer');
const $templateCard = d.querySelector('#template-card').content;
const $templateCarrito = d.querySelector('#template-carrito').content;
const $templateFooter = d.querySelector('#template-footer').content;
const $fragment = d.createDocumentFragment();
let carrito = {}

// console.log($templateCard);

const fetchData = async() => {
  try {
    const res = await fetch('api.json');
    const data = await res.json();
    // console.log(data);
    pintarCard(data);
  } catch (error) {
    console.log(error);
  }
}

d.addEventListener("click", (e) => {
  addCarrito(e);
  btnAccion(e);
});

d.addEventListener("DOMContentLoaded", () => {
  fetchData();
  if(localStorage.getItem('carrito')){
    carrito = JSON.parse(localStorage.getItem('carrito'));
    pintarCarrito();
  }
});

const pintarCard = (data) => {
  data.forEach(item => {
    // console.log(item);
    $templateCard.querySelector('h5').textContent = item.title;
    $templateCard.querySelector('p').textContent = item.precio;
    $templateCard.querySelector('img').setAttribute('src', item.thumbnailUrl);
    $templateCard.querySelector('button').dataset.id = item.id;

    const clone = $templateCard.cloneNode(true);
    $fragment.appendChild(clone);
  });
  $cards.appendChild($fragment);
}

const addCarrito = (e) => {
  // console.log(e.target.matches('.btn-primary'))
  if(e.target.classList.contains('btn-primary')){
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
}

const setCarrito = (obj) => {
  // console.log(obj)
  const producto = {
    id: obj.querySelector('.btn-primary').dataset.id,
    title: obj.querySelector('h5').textContent,
    precio: obj.querySelector('p').textContent,
    cantidad: 1
  }

  if(carrito.hasOwnProperty(producto.id)){
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = {...producto};
  // console.log(carrito)
  pintarCarrito();
}


const pintarCarrito = () => {
  // console.log(carrito);
  $items.innerHTML = '';
  Object.values(carrito).forEach(product => {
    $templateCarrito.querySelector('th').textContent = product.id,
    $templateCarrito.querySelectorAll('td')[0].textContent = product.title,
    $templateCarrito.querySelectorAll('td')[1].textContent = product.cantidad,
    $templateCarrito.querySelector('.btn-info').dataset.id = product.id,
    $templateCarrito.querySelector('.btn-danger').dataset.id = product.id,
    $templateCarrito.querySelector('span').textContent = product.precio * product.cantidad

    const clone = $templateCarrito.cloneNode(true);
    $fragment.appendChild(clone);
  });

  $items.appendChild($fragment);

  pintarFooter();

  localStorage.setItem('carrito', JSON.stringify(carrito));
}

const pintarFooter = () => {
  $footer.innerHTML = '';
  if(Object.keys(carrito).length === 0){
    $footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `;

    return;
  }

  const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0);
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad,precio}) => acc + cantidad * precio, 0);
  
  $templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
  $templateFooter.querySelector('span').textContent = nPrecio;

  const clone = $templateFooter.cloneNode(true);
  $fragment.appendChild(clone);

  $footer.appendChild($fragment);

  const $btnVaciar = document.getElementById('vaciar-carrito');

  $btnVaciar.addEventListener('click', () => {
    carrito = {};
    pintarCarrito();
  });
}

const btnAccion = (e) => {
  // console.log(e.target)
  if(e.target.matches('.btn-info')){
    const producto = carrito[e.target.dataset.id];
    producto.cantidad ++;
    carrito[e.target.dataset.id] = {...producto}
    pintarCarrito();
  }
  
  if(e.target.matches('.btnMenos')){
    carrito[e.target.dataset.id].cantidad --;
    if(carrito[e.target.dataset.id].cantidad === 0){
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }

  e.stopPropagation();
}