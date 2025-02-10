"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// import axios from 'axios';
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/', router);
// connection string with db-password db-name, password is leaked here, also manually have to put db-name here after .net/
mongoose_1.default
    .connect('mongodb+srv://admin:djbeg123*@aitravelplannercluster.96bpw.mongodb.net/?retryWrites=true&w=majority&appName=aitravelplannercluster')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));
// confirm server is running
app.listen(3001, () => {
    console.log('server is running');
});
// our api endpoint that is requested by frontend, handle logic here, sends response with data back to frontend for displaying
router.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        // return some data in our response to the reqest.
        res.status(201).json({
            message: 'test successfully created',
            test_data: 'testing 123..',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'unable to test, error: error.messag' });
    }
}));
