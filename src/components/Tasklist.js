import React, { useState } from 'react';
import Modal from 'react-modal';
import './Tasklist.css';

const tasks = [
  { id: 1, name: '1: Maak een presentatie aan voor een XT1143, Landscape, HD. \nZorg dat alle media in een \"content\" map zit', 
           hint: 'Wanneer je een presentatie aanmaakt kan je voorinstellingen doen' },
  { id: 2, name: '2: Maak de presentatie. Zorg dat je in het menu kan schakelen tussen Nederlands en Engels, maak Engels de primaire taal. Aan het einde van het filmpje moet het beeld terug naar het menu.', 
           hint: ': De primaire taal stel je niet ergens in, zorg simpelweg dat Engels je Home scherm is. \nJe hebt losse taalknoppen gekeregen, lekker handig.. Wellicht in een nieuwe zone stoppen?' },
  { id: 3, name: '3: je hebt die filmpjes nu wel een paar keer gezien, ook wel lekker als je direct uit het filmpje kan! \nGelukkig zijn daar (wederom) losse knoppen voor aangeleverd!', hint: 'Wacht weer een zone? Ik zeg ja.' },
  { id: 4, name: '4: Zorg dat je de knoppen voor het terugkeren tijdens de film niet ook op het menu ziet. Maar enkel tijdens een filmpje', hint: 'Zone........MESSAGE' },
  { id: 5, name: '5: Als bij het centrale systeem een alarm activeert willen we het geluid uit hebben, zorg dat de audio van de speler altijd met UDP bediend kan worden \nTest met Packetsender', hint: 'Nog een zone! feest!' },
  { id: 6, name: '6: Het systeem wil graag bevestigd hebben dat het audio ook uit is. Stuur een commando terug naar Packetsender die de opdracht bevestigd', hint: 'Wanneer je het UDP commando hebt ontvangen en de actie hebt uitgevoerd, dan kan je een UDP versturen. \nDit kan bijvoorbeeld \"commando_rcv\" zijn ' },
  { id: 7, name: '7: Aan de BrightSigns hangt een Molitor USO luisterhoorn met magneetschakelaar. \nZorg dat geluid alleen aan staat als de luisterhoorn van het magneet is. Hij is aangesloten op PIN 0.\nZorg ook dat het beeld naar het menu gaat als iemand de luisterhoorn terug hangt.', hint: 'Zone 100' },
  { id: 8, name: '8: Voeg een Soundscape toe, zorg dat deze alleen hoorbaar is zolang je in het menu bent. De soundscape mag niet opnieuw beginnen iedere keer als je naar het menu gaat.', hint: 'Zone 101, als je het filmpje start gebruik een commando om het volume van de zone te bedienen' },
  { id: 9, name: '9: Check! Dat was hem, als je filmpje afgelopen is, dan verdwijnt ook netjes het back knopje! Toch??', hint: 'Als het filmpje is afgelopen kan je acties toevoegen' },
];

const riddles = [
  { question: 'Wie is er ouder, Schutte of Kasper?', answer: 'Schutte' },
  { question: 'Welk bestandstype pikt BrightSign niet (.mp4 / .mov / .mpg / .avi)', answer: '.avi' },
  { question: 'Alkmaar of Rotterdam', answer: 'Alkmaar' },
  { question: 'GrandMA of HOG', answer: 'GrandMA' },
  { question: 'Wilde gok! Maximale audiozones van een BrightSign AU335 (bonushint, lol: minder dan 5)', answer: '3' },
];

Modal.setAppElement('#root');

const Tasklist = () => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [currentRiddle, setCurrentRiddle] = useState({ question: '', answer: '' }); 
  const [showHint, setShowHint] = useState(false); 
  const [error, setError] = useState(''); 

  const toggleTask = (id) => {
    setCompletedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openModal = (hint) => {
    setCurrentHint(hint);
    setShowHint(false);
    setModalIsOpen(true);
    setError(''); 
    setRiddleAnswer(''); 

    const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
    setCurrentRiddle(randomRiddle);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentHint('');
  };

  const checkRiddleAnswer = () => {
    if (riddleAnswer.toLowerCase() === currentRiddle.answer.toLowerCase()) {
      setShowHint(true); 
    } else {
      setError('Helaas, andere optie!');
    }
  };

  const allTasksDone = completedTasks.size === tasks.length;
  const nextIncompleteTaskIndex = Array.from(completedTasks).length;

  return (
    <div className='container'>
      <h1>BrightSign Demo</h1>
      <h3>Dit is een demo opgesteld hoe wij hem zo ongeveer ook krijgen vanuit klanten, kortom, soms onhandig.</h3>
      <h3>Het is een redelijk ingewikkelde presentatie, ben benieuwd of je eruit komt!</h3>
      <ul>
        {tasks.slice(0, nextIncompleteTaskIndex + 1).map((task) => (
          <li key={task.id}>
            <button
              onClick={() => toggleTask(task.id)}
              style={{
                backgroundColor: completedTasks.has(task.id) ? 'red' : 'green',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              {completedTasks.has(task.id) ? 'Undo' : 'Done'}
            </button>
            <span style={{ textDecoration: completedTasks.has(task.id) ? 'line-through' : 'none' }}>
              {task.name}
            </span>
            <button className='hint' onClick={() => openModal(task.hint)}>Hint</button>
          </li>
        ))}
      </ul>

      {allTasksDone && (
        <div className='celebrate'>
          <h2>Woehoeee! 🎉 LEKKER BEZIG!!</h2>
        </div>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Ja maar wacht ho stop ho, niet zomaar!</h2>
        {!showHint ? (
          <div>
            <p>{currentRiddle.question}</p>
            <input
              type="text"
              value={riddleAnswer}
              onChange={(e) => setRiddleAnswer(e.target.value)}
              placeholder="ANTWOORD"
            />
            <button onClick={checkRiddleAnswer}>Voer in</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        ) : (
          <div>
            <h2>Hint</h2>
            <p>{currentHint}</p>
          </div>
        )}
        <button onClick={closeModal}>Terug</button>
      </Modal>
    </div>
  );
};

export default Tasklist;
