const ContenedorArchivo = require('../../containers/ContenedorArchivo.js')

class UsersDaoArchivo extends ContenedorArchivo {

      constructor(){
            super('./src/data/usuarios.json')
      }

      save(data) {
            let usuarios = this.getAll();
            let usuario = 
            {     
                  id: 'usuarios', 
                  usuario: {
                        id: data.email,
                        nombre: data.nombre,
                        apellido: data.apellido,
                        edad: data.edad,
                        alias: data.alias,
                        avatar: data.avatar,
                  },
                  password: data.password  
            }
            usuarios.push(usuario);
            this.saveData(usuarios);
      }
      
      getByName(name){
            let data = this.getAll();
            let elem = data.find( e => e.usuario.nombre == name) || null;
            if (elem){
                  return elem;
            } else {
                  console.log('No se encontro ese nombre');
            }
      }
      
}

module.exports = UsersDaoArchivo;