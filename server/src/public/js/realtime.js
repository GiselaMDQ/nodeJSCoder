
const socket = io();
const list = document.getElementById("productList")
const form = document.getElementById("productForm")


// Se dispara cuando hay productos nuevos 
socket.on("update-products", (products) => {

  // Limpiar la lista original
  list.innerHTML = "";

  // Volver a dibujar toda la lista

    products.forEach(p => {
    const li = document.createElement("li");
    li.setAttribute("data-id", p.id);

    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <button class="delete-btn" data-id="${p.id}">Eliminar</button>
    `;
    list.appendChild(li);
  });
});

// // Agregar producto via POST
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const product = {
//     title: form.title.value,
//     price: Number(form.price.value)
//   };

//   try {
//     await fetch("/products", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(product)
//     });

//     form.reset();

//   } catch (error) {
//     console.error("Error al agregar producto:", error);
//   }
// });

//Agregar producto SOLO via socket

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    title: form.title.value,
    price: Number(form.price.value)
  };

  socket.emit("add-product", newProduct);  // 🔥 envía al server

  form.reset();
});


// //Eliminar producto usando DELETE
// document.addEventListener("click", async (e) => {
//   if (e.target.classList.contains("delete-btn")) {

//     const id = e.target.dataset.id;

//     const resp = await fetch(`/products/${id}`, {
//       method: "DELETE"
//     });

//     const result = await resp.json();
//     console.log("Producto eliminado:", result);

//     
//     // e.target.parentElement.remove();
//   }
// });


//Eliminar producto usando Socket

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;

    socket.emit("delete-product", id);    // 🔥 envía al server
  }
});