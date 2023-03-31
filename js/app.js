//const
const chipVals= [5, 10, 25, 100]
//variables
let playerMoney
let bet, dealBtn
//cached elements

const chipsEls= document.querySelectorAll(".chips>button")
const playerMoneyEls= document.getElementById('player-money')
const currentBetEls= document.getElementById('current-bet')
const dealBtnEl= document.getElementById('deal-button')

//event-listeners
chipsEls.forEach(function(chip, idx){
  chip.innerText=`$${chipVals[idx]}`
  chip.addEventListener('click', handleClick)
})

dealBtnEl.addEventListener('click', dealBtnHandleClick)
//functions
function init(){
  playerMoney= 1000
  playerMoneyEls.innerText= `Total Money: $${playerMoney}`
  bet= 0
  currentBetEls.innerText= `Current bet: $${bet}`
}
init()

function handleClick(evt){
  if (!bet){
    dealBtnEl.style.display= 'inline-block'
  } 
  if (playerMoney>=(parseInt(evt.target.id))){
    playerMoney-=(parseInt(evt.target.id))
    playerMoneyEls.innerText= `$${playerMoney}`
    bet+=(parseInt(evt.target.id))
    currentBetEls.innerText= `Current bet: $${bet}`
  }
}

function dealBtnHandleClick(){
  console.log('clicked')
}