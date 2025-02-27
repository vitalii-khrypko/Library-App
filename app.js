import { Model } from "./Models/Model.js";
import { View } from "./Views/View.js";
import { Controller } from "./Controllers/Controller.js";

const model = new Model();
const view = new View();
const controller = new Controller(model, view);