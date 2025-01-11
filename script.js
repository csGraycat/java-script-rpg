let xp = 0
let health = 100
let gold = 50
let currentWeapon = 0
let fighting
let monsterHealth
let inventory = ["stick"]

const button1 = document.querySelector("#button1")  // store button
const button2 = document.querySelector("#button2") // cave button
const button3 = document.querySelector("#button3")  // fight button
const text = document.querySelector("#text")
const xpText = document.querySelector("#xpText")
const healthText = document.querySelector("#healthText")
const goldText = document.querySelector("#goldText")
const monsterStats = document.querySelector("#monsterStats")
const monsterNameText = document.querySelector("#monsterName")
const monsterHealthText = document.querySelector("#monsterHealth")

const weapons = [
    {
        name: "stick",
        power: 5,
    },
    {
        name: "dagger",
        power: 30,
    },
    {
        name: "claw hammer",
        power: 50,
    },
    {
        name: "sword",
        power: 100,
    },
]

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15,
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60,
    },
    {
        name: "dragon",
        level: 20,
        health: 300,
    },
]

const locations = [
    {
        name: "town square",  // 0
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: 'You are at the town square. You see a sign that says "Store".'
    },
    {
        name: "store",  // 1
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go back"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",  // 2
        "button text": ["Fight Slime", "Fight beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You go down the cave. You see some monsters."
    },
    {
        name: "fight",  // 3
        "button text": ["Attack", "Dodge", "Run away"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",  // 4
        "button text": ["Continue exploring", "Go to town square", "Go to town square"],
        "button functions": [goCave, goTown, easterEgg],
        text: "The monster is defeated. You collect XP and gold."
    },
    {
        name: "lose",  // 5
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "You die. Game over."
    },
    {
        name: "win",  // 6
        "button text": ["Replay?", "Replay?", "Replay?"],
        "button functions": [restart, restart, restart],
        text: "Great job! You defeated the dragon!"
    },
    {
        name: "easter egg",  // 7
        "button text": ["Pick 2", "Pick 8", "Go to town square"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game! Pick a number above. 10 numbers will be randomly created. If your guess is among the numbers - you win!"
    },
]


// initialize buttons
button1.onclick = goStore
button2.onclick = goCave
button3.onclick = fightDragon

function update(location) {
    monsterStats.style.display = "none"
    
    button1.innerText = location["button text"][0]
    button2.innerText = location["button text"][1]
    button3.innerText = location["button text"][2]

    button1.onclick = location["button functions"][0]
    button2.onclick = location["button functions"][1]
    button3.onclick = location["button functions"][2]
    
    text.innerText = location.text
}

function goTown() {
    update(locations[0])
}

function goStore() {
    update(locations[1])
}

function goCave() {
    update(locations[2])
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10
        health += 10
        goldText.innerText = gold
        healthText.innerText = health
    } else {
        text.innerText = "Not enough gold."
    }
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30
            currentWeapon++
            goldText.innerText = gold
            let newWeapon = weapons[currentWeapon].name
            text.innerText = "You now have a " + newWeapon + "."
            inventory.push(newWeapon)
            text.innerText += " In your inventory you have: " + inventory
        } else {
            text.innerText = "Not enough gold."
        }
    } else {
        text.innerText = "You already have the most powerful weapon!"
        button2.innerText = "Sell weapon for 15 gold"
        button2.onclick = sellWeapon
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15
        goldText.innerText = gold
        let currentWeapon = inventory.shift()
        text.innerText = "Sold " + currentWeapon + "."
        text.innerText += " In your inventory you have: " + inventory
    } else {
        text.innerText = "No more weapons to sell."
    }
}

function fightSlime() {
    fighting = 0
    goFight()
}

function fightBeast() {
    fighting = 1
    goFight()
}

function fightDragon() {
    fighting = 2
    goFight()
}

function goFight() {
    update(locations[3])
    monsterHealth = monsters[fighting].health
    monsterStats.style.display = "block"
    monsterNameText.innerText = monsters[fighting].name
    monsterHealthText.innerText = monsterHealth
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks."
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + "."
    
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level)
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1
    } else {
        text.innerText += " You miss."
    }
    
    healthText.innerText = health
    monsterHealthText.innerText = monsterHealth
    if (health <= 0) {
        healthText.innerText = "0"
        lose()
    } else if (monsterHealth <= 0) {
        fighting === 2 ? winGame() : defeatMonster()
    }

    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks."
        text.innerText += " In your inventory you have: " + inventory
        currentWeapon--
    }
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp))
    if (hit < 0) {
        hit = Math.floor(Math.random())
    }
    console.log(hit)
    return hit
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20
}

function dodge() {
    text.innerText = "You dodge the attack from " + monsters[fighting].name + "."
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7)
    xp += monsters[fighting].level
    goldText.innerText = gold
    xpText.innerText = xp
    update(locations[4])
}

function showInventory() {
    text.innerText = " In your inventory you have: " + inventory
}

function lose() {
    update(locations[5])
}

function winGame() {
    update(locations[6])
}

function restart() {
    xp = 0
    health = 100
    gold = 50
    currentWeapon = 0
    inventory = ["stick"]
    xpText.innerText = xp
    healthText.innerText = health
    goldText.innerText = gold
    goTown()
}

function easterEgg() {
    update(locations[7])
}

function pickTwo() {
    pick(2)
}

function pickEight() {
    pick(8)
}

function pick(guess) {
    let numbers = []
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11))
    }

    text.innerText = "You picked " + guess + ". Here are the numbers created:\n"

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\xa0"
    }
    text.innerText += "\n"

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Right! You win 20 gold! Play again?"
        gold += 20
        goldText.innerText = gold
    } else {
        text.innerText += "Wrong! You lose 10 health. Play again?"
        health -= 10
        healthText.innerText = health
        if (health <= 0) {
            healthText.innerText = "0"
            lose()
        }
    }
}
