import { useEffect, useState } from "react";
import React from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState([]);
  const [tenzies, setTenzies] = useState(false)
  const [count, setCount] = useState(0)


  //first render 
  useEffect(() => {
    allNewDice();
  }, []);

  useEffect(() => {
    console.log('Dice:', dice);
    const allEqual = dice.every(die => die.value === dice[0]?.value);
    setTenzies(allEqual);
  }, [dice]);

  // winning condition and reset game 
  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const allSameValue = dice.every(die => die.value === dice[0].value)
    allHeld && allSameValue ? setTenzies(true) : setTenzies(false)
  },[dice])

  // reset game 
  const resetGame = () => {
    setDice(prevDice => prevDice.map(die => (generateNewDie())))
    setTenzies(false)
    setCount(count => count + 1)
  }

  //generate a new die 
  const generateNewDie = () => {
    return { 
      isHeld: false, 
      value: Math.ceil(Math.random() * 6), 
      id: nanoid() };
  };
  const holdDice = (id) => {
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  };


  // dice roll function 
  const rollDice = (id) => {
    setTenzies(false)
    setDice((prevDice) =>
      prevDice.map((die) =>
        die.isHeld
          ? die
          : generateNewDie()
      )
    );
  };


// generate and set a new array of 10 dice, each with a random value and unique ID
  const allNewDice = () => {
    
    setDice(prevDice =>{ 
      const arr = []
      for (let i = 0; i < 10; i++) {
        arr.push(generateNewDie());
      }
      return arr
    });
  };

  // die element 
  const diceElement = dice.map((item, i) => (
    <Die
      holdDice={() => holdDice(item.id)}
      isHeld={item.isHeld}
      key={i}
      value={item.value}
    />
  ));

  return (
    <div>
      <main>
        <div className="game-container">
          <h1>Tenzies game</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className="grid-container">{diceElement}</div>
          {
            tenzies === true 
              ?<div><Confetti /> <button onClick={() => resetGame()}>New Game</button></div>
              :<button onClick={() => rollDice()}>Roll</button>
          }
          <h2>you WON {count} {tenzies > 1 ? 'Times' : 'Time'}</h2>
        </div>
      </main>
    </div>
  );
}

export default App;
