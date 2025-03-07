"use strict";
/*
* ***NOT PUSHED***
* This file is used in the handleing of passwords and other sensitive data.
* Right now it contains a simple test case to explain what methods we are using to protect data
* We have chosen to hash and then salt our passwords as opposed to encypting them. This is becuse encryption is cracked once the key is figured out.
* Hashing is a one way function that cannot be reversed. But a string generates the same hash everytime, you would think this is a bad issue (and it is)
* Hence why we salt passwords. This makes them unique and unguessable. Should we have unwanted entrance to our database, the passwords will be useless to the hacker.
* Salting is the process of adding a random string to the password before hashing it. This makes it unique and unguessable.
*
*
*
* A walkthough of this process by hand:
* Given a password: "password123"
*
* Step 1: Generate a random salt string (only one salt round):
* Salt string = X7h8!
*
* Step 2: Combine the password and salt string:
* Combined string = "password123X7h8!"
*
* With this combined string, we will now hash it using a hashing algorithm. This differ so here's a contrived example:
*
* Step 3: Convert the combined string to ASCII and apply a transfromation based on ASCII value and postion in the string:
*
* P ASCII (112) X postion (1) = 112
* a ASCII (97) X postion (2) = 194
* s ASCII (115) X postion (3) = 345
* s ASCII (115) X postion (4) = 460
* w ASCII (119) X postion (5) = 595
* o ASCII (111) X postion (6) = 666
* r ASCII (114) X postion (7) = 798
* d ASCII (100) X postion (8) = 800
* 1 ASCII (49) X postion (9) = 441
* 2 ASCII (50) X postion (10) = 500
* 3 ASCII (51) X postion (11) = 561
* X ASCII (88) X postion (12) = 1056
* 7 ASCII (55) X postion (13) = 715
* h ASCII (104) X postion (14) = 1456
* 8 ASCII (56) X postion (15) = 840
* ! ASCII (33) X postion (16) = 528
*
* Step 4: Add all the values together and take a modulus with a prime number
*
* Total = 112 + 194 + 345 + 460 + 595 + 666 + 798 + 800 + 441 + 500 + 561 + 1056 + 715 + 1456 + 840 + 528 = 10067
*
* modedValue = 10067 % 997 = 97
*
* we would store this hashed value in our database and when the user logs in we would calculate the hash value of the password they entered
* and compare it to the stored value. If they match, the password is correct, if not reject the log in.
*
* In our project I'll turn the number of salt rounds up the above example uses one between this and a randomly generated salt key we should be safe.
*
* For further protection (mostly aginst rainbow tables) we could add a pepper key (a secondary salt key that would salt the salted password) but we would have to store
* this outside of the database which might make log in verification a bit more difficult. Salting takes time and like in all things computing we don't want to wait
* longer than we have to, which is why our salt rounds can't be too high.
*
* TLDR: We can secure our user's passwords though hashing and salting. This is safer than encyption as it is a one way function and cannot be reversed.
* Should we have unwanted entrance to our database, the passwords will be useless to the hacker.
*
* Side Note for those who are currious: a rainbow table is a precomputed table of hashe. That is why we salt our passwords it makes them unique and unguessable.
*
*
* PREPARED BY JAKE KISTLER 2/10/25
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const SALT_ROUNDS = 10; // The number of times to salt the password
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt(SALT_ROUNDS); // generate a salt key
        const hashedPassword = yield bcrypt.hash(password, salt); // hash the password with the salt key
        console.log(`Hashed password: ${hashedPassword}`); // DEBUG: display the password
        return hashedPassword; // kick the password back
    });
}
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt.compare(password, hashedPassword); // compare the password to the hashed password
        console.log(`Password match: ${isMatch}`); // DEBUG: display the result
        return isMatch; // return the result
    });
}
// Example usage:
(() => __awaiter(void 0, void 0, void 0, function* () {
    const password = 'password123';
    const hashedPassword = yield hashPassword(password); // hash the password
    // sim a log in check
    const isPasswordAMatch = yield verifyPassword('password123', hashedPassword); // check the password
    console.log(`Password verification result:', ${isPasswordAMatch}`); // DEBUG: display the result
}))();
