import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
  element.textContent = ''

  loadInterval = setInterval(() => { 
    element.textContent += '.'

     // While bot is thinking, when the loading dots occur and it reached the fourth dot it will reset back to zero and continue on with its loop until it answers the question
  if(element.textContent === '....') {
    element.textContent= ' '
  }
  }, 300 )

 
}

// The action for the bot when replying to user input
function typeText (element, text) {
  let index = 0
  
  let interval =setInterval( () => {
    // If bot is still typing continue on to show the user the text as it types
    if (index < text.length) {
      element.innerHtml += text.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20)
}

// This function will generate random IDs
function generateUniqueId() {
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timestamp}-${hexadecimalString}`
}

// This stripe sepearates the user from the AI so the user's experience is a good one
function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div>
    
    `
  )
}


// this handles the action once the user submits the form for the bot to receive
const handleSubmit = async (e) => {
  // Will prevent the deafult behaviour of the browser
  e.preventDefault()

  const data = new FormData(form)

  // User's stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

  form.reset()

  // bot's stripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

  // As the bot types the bot's stripe will adject accordingly
  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)
}

// Event Listener for the app to listen for when the user submits their prompt
form.addEventListener('submit', handleSubmit)

// Event lister for whent the user presses the enter key
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e)
  }
})