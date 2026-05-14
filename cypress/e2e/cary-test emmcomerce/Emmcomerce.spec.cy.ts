
describe("Test 1: Comprobación de datos de productos", () => {  


  it("Interceptar la petición a la API y verificar los datos de los productos", () => {  
        cy.intercept("GET", '**/products*').as("getProducts");  

    // Navegar a la página de productos  
    cy.visit('/');  

    // Esperar a que la petición se complete y verificar  
    cy.wait("@getProducts").then((interception) => {  
      expect(interception.response, 'Respuesta recibida').to.exist;
      // Verificar que la respuesta fue exitosa  
      expect(interception.response?.statusCode).to.eq(200);  

      const productos = interception.response?.body;  

      // Verificar que se recibieron productos  
      expect(productos, 'Debe haber al menos un producto').to.have.length.greaterThan(0);  

      // Validar la estructura de cada producto  
      productos.forEach((producto:any, index:number) => {  
        const prod = `Producto ${index + 1}:`;  

        expect(producto, `${prod} debe tener id`).to.have.property("id").that.is.a("number");  
        expect(producto, `${prod} debe tener title`).to.have.property("title").that.is.a("string").and.not.be.empty;  
        expect(producto, `${prod} debe tener price`).to.have.property("price").that.is.a("number");  
        expect(producto, `${prod} debe tener description`).to.have.property("description").that.is.a("string").and.not.be.empty;  
        expect(producto, `${prod} debe tener category`).to.have.property("category").that.is.a("string").and.not.be.empty;  
        expect(producto, `${prod} debe tener image`).to.have.property("image").that.is.a("string").and.not.be.empty;  

        // Validar que el precio sea positivo  
        expect(producto.price, `${prod} price debe ser positivo`).to.be.greaterThan(0);  

      });  
    });  
  });  

    
  })
  