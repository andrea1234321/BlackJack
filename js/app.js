//const---------------------------------------------------------------
const chipVals= [5, 10, 25, 100]
const blackjackChipVal= [2.5]

//variables-----------------------------------------------------------
let playerMoney, bet, dealerCardCount, playerCardCount
let deck= []
let playerCards= []
let dealerCards= []
let discardPile= []


//cached elements------------------------------------------------------
const chipsEls= document.querySelectorAll(".chips>button")
const blackjackChipEl= document.getElementById('chip2_5')
const playerMoneyEl= document.getElementById('player-money')
const currentBetEl= document.getElementById('current-bet')
const dealBtnEl= document.getElementById('deal-button')
const resetBetBtnEl= document.getElementById('reset-bet-button')
const initialCardsEl= document.querySelectorAll('#initial-cards')
const dealerCardsEl= document.querySelector('.dealer-card-container')
const playerCardsEl= document.querySelector('.player-card-container')
const doubleBtnEl= document.getElementById('double-button')
const hitBtnEl= document.getElementById('hit-button')
const stayBtnEl= document.getElementById('stay-button')
const discardBtnEl= document.getElementById('discard-button')
const playerMessageEl= document.getElementById('player-message')
const playerCardCounterEl= document.getElementById('player-card-counter')
const dealerCardCounterEl= document.getElementById('dealer-card-counter')
const resetGameBtnEl= document.getElementById('reset-game-button')


//event-listeners-------------------------------------------------------
chipsEls.forEach(function(chip, idx){
  chip.innerText=`${chipVals[idx]}`
  chip.addEventListener('click', chipHandleClick)
})

blackjackChipEl.addEventListener('click', blackjackChipHandleClick)
dealBtnEl.addEventListener('click', dealBtnHandleClick)
resetBetBtnEl.addEventListener('click', resetBetHandleClick)
doubleBtnEl.addEventListener('click', doubleDown)
hitBtnEl.addEventListener('click', hitButton)
stayBtnEl.addEventListener('click', stayButton)
discardBtnEl.addEventListener('click', discardBtnHandleClick)
resetGameBtnEl.addEventListener('click', resetGame)


//functions----------------------------------------------------------
function init(){
  playerMoney= 100
  bet= 0
  deck = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]
  step= 'card outline'
  render()
}
init()

function render(){
  updateMessageBoard()
  updateBtns()
  updatePlayingField()
}

function updateMessageBoard(){
  playerMoneyEl.innerText= `Total Money: $${playerMoney}`
  currentBetEl.innerText= `Current bet: $${bet}`
  playerCardCounterEl.innerText= ''
  dealerCardCounterEl.innerText= ''
  playerMessageEl.innerText= ''
  if (step==='deal' || step==='hit'){
    playerCardCounterEl.innerText= `Card total: ${playerCardCount}`
  }else if (step==='stay' || step=== 'double'){
    cardCounter()
  }else if (step=== 'no double'){
    playerCardCounterEl.innerText= `Card total: ${playerCardCount}`
    playerMessageEl.innerText= `Sorry you don't have enough money to double your bet`
  }else if (step==='bust'){
    cardCounter()
    playerMessageEl.innerText= `Sorry you busted!`
  }else if (step=== 'player blackjack'){
    cardCounter()
    playerMessageEl.innerText= `Congratulations you got blackjack, it pays 3/2`
  }else if (step==='dealer blackjack'){
    cardCounter()
    playerMessageEl.innerText= `I'm sorry dealer got blackjack`
  }else if (step=== 'blackjack push'){
    cardCounter()
    playerMessageEl.innerText= `Yay you got blackjack, but unfortunately so did the dealer, you pushed`
  }else if (step=== 'player wins'){
    cardCounter()
    playerMessageEl.innerText= `Yay you win! you get 2X your bet!`
  }else if (step=== 'push'){
    cardCounter()
    playerMessageEl.innerText= `You pushed the dealer!`
  }else if (step=== 'dealer wins'){
    cardCounter()
    playerMessageEl.innerText= `Sorry dealer wins this round`
  }else if (step==='no money'){
    playerMessageEl.innerText= `It looks like you have ran out of money! If you wanna keep playing just go to the ATM and cash out some more money!`
  }
}

function cardCounter(){
  playerCardCounterEl.innerText= `Card total: ${playerCardCount}`
  dealerCardCounterEl.innerText= `Dealer card total: ${dealerCardCount}`
}
// function cardCounter(){
//   playerCardCounterEl.innerText= ''
//   dealerCardCounterEl.innerText= ''
//   if (step!== 'card outline' || step!== 'chip' || step!== 'deal' || step!== 'hit'){
//     dealerCardCounterEl.innerText= `Dealer card total: ${dealerCardCount}`
//     playerCardCounterEl.innerText= `Player card total: ${playerCardCount}`
//   }
// }

function updateBtns(){
  resetGameBtnEl.style.visibility= 'hidden'
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  doubleBtnEl.style.visibility= 'hidden'
  hitBtnEl.style.visibility= 'hidden'
  stayBtnEl.style.visibility= 'hidden'
  discardBtnEl.style.visibility= 'hidden'
  chipsEls.forEach(function(chip){
    chip.style.visibility= 'visible'
    chip.disabled= false
  })
  blackjackChipEl.disabled= false
  blackjackChipEl.style.visibility= 'visible'
  if (step==='card outline' || step=== 'reset'){
    dealBtnEl.style.visibility= 'hidden'
  }else if (step==='chip'){
    dealBtnEl.style.visibility= 'visible'
    resetBetBtnEl.style.visibility= 'visible'
  }else if (step==='deal'){
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    blackjackChipEl.disabled= true
    doubleBtnEl.style.visibility= 'visible'
    stayBtnEl.style.visibility= 'visible'
    hitBtnEl.style.visibility= 'visible'
  }else if (step==='hit'){
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    blackjackChipEl.disabled= true
    stayBtnEl.style.visibility= 'visible'
    hitBtnEl.style.visibility= 'visible'
  }else if (step=== 'double'){
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    blackjackChipEl.disabled= true
    discardBtnEl.style.visibility= 'visible'
  }else if (step=== 'no money'){
    chipsEls.forEach(function(chip){
      chip.style.visibility= 'hidden'
    })
    blackjackChipEl.style.visibility='hidden'
    resetGameBtnEl.style.visibility= 'visible'
  }else{
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    blackjackChipEl.disabled= true
    discardBtnEl.style.visibility= 'visible'
  }
}


function updatePlayingField(){
  if (step==='card outline' || step==='chip' | step==='reset' | step=== 'no money'){
    //4 empty cards
    playerCardsEl.replaceChildren()
    dealerCardsEl.replaceChildren()
    for (let i=0; i<2; i++){
      const playersCardsOutline= document.createElement('div')
      playersCardsOutline.setAttribute('class', `card large outline`)
      playerCardsEl.appendChild(playersCardsOutline)
    }
    for (let i=0; i<2; i++){
      const dealersCardsOutline= document.createElement('div')
      dealersCardsOutline.setAttribute('class', `card large outline`)
      dealerCardsEl.appendChild(dealersCardsOutline)
    }
  }else if (step==='deal'){
    //dealer face down card
    playerCardsEl.replaceChildren()
    dealerCardsEl.replaceChildren()
    let dealerfirstCard= document.createElement('div')
    dealerfirstCard.setAttribute('id', `dealer-first-card`)
    dealerfirstCard.setAttribute('class', `card large back-vintage-vegas animate__animated animate__fadeInRightBig`)
    dealerCardsEl.appendChild(dealerfirstCard)
    let dealerCurrentCards= document.createElement('div')
    dealerCurrentCards.setAttribute('id', `dealer-second-card`)
    dealerCurrentCards.setAttribute('class', `card large ${dealerCards[1]} animate__animated animate__fadeInRightBig`)
    dealerCardsEl.appendChild(dealerCurrentCards)
    let playerFirstCard= document.createElement('div')
    playerFirstCard.setAttribute('id', 'player-first-card')
    playerFirstCard.setAttribute('class', `card large ${playerCards[0]} animate__animated animate__fadeInRightBig`)
    playerCardsEl.appendChild(playerFirstCard)
    let playerSecondCard= document.createElement('div')
    playerSecondCard.setAttribute('id', 'player-second-card')
    playerSecondCard.setAttribute('class', `card large ${playerCards[1]} animate__animated animate__fadeInRightBig`)
    playerCardsEl.appendChild(playerSecondCard)
  }else if (step=== 'hit'){
    playerCardsEl.replaceChildren()
    dealerCardsEl.replaceChildren()
    let dealerfirstCard= document.createElement('div')
    dealerfirstCard.setAttribute('class', `card large back-vintage-vegas`)
    dealerCardsEl.appendChild(dealerfirstCard)
    let dealerCurrentCards= document.createElement('div')
    dealerCurrentCards.setAttribute('class', `card large ${dealerCards[1]}`)
    dealerCardsEl.appendChild(dealerCurrentCards)
    playerCards.forEach(function (cardName){
      let playerCurrentCards= document.createElement('div')
      playerCurrentCards.setAttribute('class', `card large ${cardName}`)
      playerCardsEl.appendChild(playerCurrentCards)
    })
  }else{
    playerCardsEl.replaceChildren()
    dealerCardsEl.replaceChildren()
    dealerCards.forEach(function (cardName){
      let dealerCurrentCards= document.createElement('div')
      dealerCurrentCards.setAttribute('class', `card large ${cardName}`)
      dealerCardsEl.appendChild(dealerCurrentCards)
    })
    playerCards.forEach(function (cardName){
      let playerCurrentCards= document.createElement('div')
      playerCurrentCards.setAttribute('class', `card large ${cardName}`)
      playerCardsEl.appendChild(playerCurrentCards)
    })
  }
} 

function chipHandleClick(evt){
  if (playerMoney>=(parseInt(evt.target.id.slice(4,7)))){
    step= 'chip'
    playerMoney-=(parseInt(evt.target.id.slice(4,7)))
    bet+=(parseInt(evt.target.id.slice(4,7)))
  }
  render()
}

function blackjackChipHandleClick(evt){
  if (playerMoney>=(2.5)){
    step= 'chip'
    playerMoney-= 2.5
    bet+= 2.5
  }
  render()
}

function resetBetHandleClick(){
  step= 'reset'
  playerMoney+= bet
  bet=0
  render()
}

function dealBtnHandleClick(){
  step= 'deal'
  dealPlayerFirstCards()
  dealDealerFirstCards()
  checkForBlackJack()
}

function dealPlayerFirstCards(){
  for (let i=0; i<2; i++){
    let randomCard= deck[(Math.floor(Math.random()*deck.length))]
    playerCards.push(randomCard)
    discardPile.push(randomCard)
    let randomCardIdx= deck.indexOf(randomCard)
    deck.splice(randomCardIdx, 1)
  }
}

function dealDealerFirstCards(){
  for (let i=0; i<2; i++){
    let randomCard= deck[(Math.floor(Math.random()*deck.length))]
    dealerCards.push(randomCard)
    discardPile.push(randomCard)
    let randomCardIdx= deck.indexOf(randomCard)
    deck.splice(randomCardIdx, 1)
  }
}

function dealPlayerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  playerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  playerTotal()
}

function dealDealerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  dealerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  checkDealerCards()
}

function doubleDown(){
  if (playerMoney>=bet){
    step= 'double'
    playerMoney-= bet
    bet+= bet
    dealPlayerCards()
    checkForBust()
    if(step!== 'bust'){
      checkDealerCards()
    }
    render()
  }else{
    step= 'no double'
    updateMessageBoard()
  }
}

function hitButton(){
  step= 'hit'
  dealPlayerCards()
  checkForBust()
  render()
}

function stayButton(){
  step= 'stay'
  checkDealerCards()
  render()
}


function playerTotal(){
  playerCardCount=0
  cardsArr=[]
  playerCards.forEach(function(card){
    let cardValue= card.slice(1,3)
    cardsArr.push(cardValue)
    if (cardValue=== 'K' || cardValue=== 'Q' || cardValue=== 'J'){
      playerCardCount+=10
    }
    else if (parseInt(cardValue)){
      playerCardCount+= parseInt(cardValue)
    }else if (cardValue=== 'A'){
      playerCardCount+=1
    }
  })
  if (playerCardCount<12 && cardsArr.includes("A")){
    playerCardCount+=10
  }
}

function dealerTotal(){
  dealerCardCount=0
  cardsArr=[]
  dealerCards.forEach(function(card){
    let cardValue= card.slice(1,3)
    cardsArr.push(cardValue)
    if (cardValue=== 'K' || cardValue=== 'Q' || cardValue=== 'J'){
      dealerCardCount+=10
    }
    else if (parseInt(cardValue)){
      dealerCardCount+= parseInt(cardValue)
    }else if (cardValue=== 'A'){
      dealerCardCount+=1
    }
  })
  if (dealerCardCount<12 && cardsArr.includes("A")){
    dealerCardCount+=10
  }
}

function checkForBust(){
  playerTotal()
  if (playerCardCount>21){
    step= 'bust'
  }
}

function checkForBlackJack(){
  playerTotal()
  dealerTotal()
  if (playerCardCount===21 && dealerCardCount!==21){
    step= 'player blackjack'
  } else if (playerCardCount!==21 && dealerCardCount===21){
    step= 'dealer blackjack'
  } else if (playerCardCount===21 && dealerCardCount===21){
    step= 'blackjack push'
  }
  render()
}

function checkDealerCards(){
  dealerTotal()
  if (dealerCardCount<17){
    dealDealerCards()
  }else if (dealerCardCount>21){
    step= 'player wins'
  }else if (dealerCardCount>=17 && dealerCardCount<=21){
    compareHands()
  }
}

function compareHands(){
  if (playerCardCount> dealerCardCount){
    step= 'player wins'
  }else if (playerCardCount=== dealerCardCount){
    step= 'push'
  }else{
    step= 'dealer wins'
  }
}

function checkDeck(){
  if (deck.length<10){
    deck.forEach(function(card){
      discardPile.push(card)
      deck= discardPile
    })
    discardPile= []
  }
}

function checkMoney(){
  if (playerMoney===0){
    step= 'no money'
  }
}

function discardBtnHandleClick(){
  if (step==='player blackjack'){
    playerMoney+= bet+(bet*(3/2))
    bet=0
  }else if (step==='blackjack push' || step==='push'){
    playerMoney+= bet
    bet=0
  }else if (step==='player wins'){
    playerMoney+= (bet*2)
    bet=0
  }else{
    playerMoney
    bet=0
  }
  step= 'card outline'
  checkDeck()
  checkMoney()
  playerCards=[]
  dealerCards=[]
  render()
}

function resetGame(){
  init()
}
