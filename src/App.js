import { useState, useEffect } from 'react'
import userImage from "./images/user.png"
import assistantImage from "./images/robot.avif"

const App = () => {
  const [ value, setValue] = useState("");
  const [ message, setMessage] = useState(null);
  const [ previousChats, setPreviousChats] = useState([]);
  const [ currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch("http://localhost:8000/completions", options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value !== "" && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value !== "" && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "user",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
      setValue("")
    }
  }, [message, currentTitle])

  const handleKey = (e) => {
    if (e.keyCode === 13) {
      getMessages()
    }
  }

  const handleImage = (role) => {
    if (role === "user") {
      //display user profile
      return userImage
    } else {
      //display robot profile
      return assistantImage
    }
  }

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Vincent</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>ChattyGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <img alt="role-pic" className="role" src={handleImage(chatMessage.role)}></img>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
            <div className="input-container">
              <input id ="input" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKey}/>
              <div id="submit" onClick={getMessages}>➢</div>
            </div>
            <p className="info">
              Chat GPT Mar 14 Version. Free Research Preview.
            </p>
        </div>
      </section>
    </div>
  );
}

export default App;
