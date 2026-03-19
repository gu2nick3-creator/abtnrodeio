import bcrypt from 'bcryptjs';

const senha = 'abtn123@';
const hash = await bcrypt.hash(senha, 10);
console.log(hash);
