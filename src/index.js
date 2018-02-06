
import Character from "./classes/Character.js";

main();

function main() {
    //let characters = [];
    
    let lyn = new Character("Lyn");
    
    let element = document.createElement("h1");
    
    element.textContent = lyn.weapon.name;
    
    document.body.appendChild(element);
}
