import { compare, hash } from "bcrypt";

class Crypto {
    encrypt(password){
        return hash(password, 7);
    }

    decrypt(password, hashedPassword) {
        return compare(password, hashedPassword);
    }
}

export default new Crypto();