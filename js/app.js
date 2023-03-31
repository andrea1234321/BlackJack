//const
const chipVals= [5, 10, 25, 100]
//variables
let playerMoney, bet, dealBtn
let deck= []
let playerCards= []
let dealerCards= []
//cached elements

const chipsEls= document.querySelectorAll(".chips>button")
const playerMoneyEl= document.getElementById('player-money')
const currentBetEl= document.getElementById('current-bet')
const dealBtnEl= document.getElementById('deal-button')
const resetBetBtnEl= document.getElementById('reset-bet-button')

const dealerFirstCard= document.getElementById("dealer-first-card")
const dealerSecondCard= document.getElementById("dealer-second-card")
const playerFirstCard= document.getElementById("player-first-card")
const playerSecondCard= document.getElementById("player-second-card")

//event-listeners
chipsEls.forEach(function(chip, idx){
  chip.innerText=`$${chipVals[idx]}`
  chip.addEventListener('click', handleClick)
})

dealBtnEl.addEventListener('click', dealBtnHandleClick)
resetBetBtnEl.addEventListener('click', resetBetHandleClick)

//functions
function init(){
  playerMoney= 1000
  playerMoneyEl.innerText= `Total Money: $${playerMoney}`
  bet= 0
  currentBetEl.innerText= `Current bet: $${bet}`
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  deck = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]
}
init()

function handleClick(evt){
  if (!bet){
    dealBtnEl.style.visibility= 'visible'
    resetBetBtnEl.style.visibility= 'visible'
  } 
  if (playerMoney>=(parseInt(evt.target.id))){
    playerMoney-=(parseInt(evt.target.id))
    playerMoneyEl.innerText= `$${playerMoney}`
    bet+=(parseInt(evt.target.id))
    currentBetEl.innerText= `Current bet: $${bet}`
  }
}

function dealBtnHandleClick(){
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  chipsEls.forEach(function(chip){
    // chip.removeEventListener('click', handleClick)
    chip.disabled='true'
  })
  dealCards()
}

function resetBetHandleClick(){
  init()
}

function dealCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  playerCards.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  render(randomCard)
}

function render(randomCard){
  playerFirstCard.classList.remove('outline')
  playerFirstCard.classList.add(randomCard)
}