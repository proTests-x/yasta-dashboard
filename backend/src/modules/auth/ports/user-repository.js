/**
 * Puerto de salida del módulo de autenticación.
 * Los adaptadores concretos pueden usar memoria, archivos o una base de datos.
 */
export class UserRepository {
  async findByEmail(_email) { throw new Error("Not implemented"); }
  async findById(_id) { throw new Error("Not implemented"); }
  async add(_user) { throw new Error("Not implemented"); }
}
