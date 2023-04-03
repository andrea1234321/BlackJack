//const
const chipVals= [5, 10, 25, 100]
//variables
let playerMoney, bet, cardsOutline, dealerCardCount, playerCardCount, round, blackJack
let deck= []
let playerCards= []
let dealerCards= []
let discardPile= []
//cached elements

const chipsEls= document.querySelectorAll(".chips>button")
const playerMoneyEl= document.getElementById('player-money')
const currentBetEl= document.getElementById('current-bet')
const dealBtnEl= document.getElementById('deal-button')
const resetBetBtnEl= document.getElementById('reset-bet-button')
const initialCardsEl= document.querySelectorAll('#initial-cards')
const dealerCardsEl= document.querySelector('.dealer-card-container')
const playerCardsEl= document.querySelector('.player-card-container')
const hitBtnEl= document.getElementById('hit-button')
const stayBtnEl= document.getElementById('stay-button')
const discardBtnEl= document.getElementById('discard-button')
const playerMessageEl= document.getElementById('player-message')
const dealerMessageEl= document.getElementById('dealer-message')



//event-listeners
chipsEls.forEach(function(chip, idx){
  chip.innerText=`$${chipVals[idx]}`
  chip.addEventListener('click', handleClick)
})

dealBtnEl.addEventListener('click', dealBtnHandleClick)
resetBetBtnEl.addEventListener('click', resetBetHandleClick)
hitBtnEl.addEventListener('click', hitButton)
stayBtnEl.addEventListener('click', stayButton)
discardBtnEl.addEventListener('click', renderInit)

//functions
function init(){
  playerMoney= 1000
  bet= 0
  deck = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]
  step= 'card outline'
  blackJack= false
  round= 0
  renderInit()
}
init()

function renderInit(){
  updateMessageBoard()
  updateBtns()
  updatePlayingField()
}

function updateMessageBoard(){
  playerMoneyEl.innerText= `Total Money: $${playerMoney}`
  currentBetEl.innerText= `Current bet: $${bet}`
  if (playerCardCount<21){
    playerMessageEl.innerText= `Card total: ${playerCardCount}`
  }else if (playerCardCount>21){
    playerMessageEl.innerText= `Card total: ${playerCardCount}, sorry you busted`
  }else if (step==='player blackjack'){
    playerMessageEl.innerText= `Card total: ${playerCardCount}, congratulations you got blackjack, it pays 3/2`
  }else if (playerCardCount===21 && dealerCardCount!==21){
    playerMessageEl.innerText= `Card total: ${playerCardCount}, aye 21, I would stay if i were you`
  }else if (dealerCardCount===21 && dealerCards.length===2){
    playerMessageEl.innerText= `Sorry, dealer got blackjack`
  }if (step==='stayBtn'){
    dealerMessageEl.innerText= `Dealer card total: ${dealerCardCount}`
  }
}

function updateBtns(){
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  hitBtnEl.style.visibility= 'hidden'
  stayBtnEl.style.visibility= 'hidden'
  discardBtnEl.style.visibility= 'hidden'
  chipsEls.forEach(function(chip){
    chip.disabled= false
  })
  if (step==='chipBtn'){
    dealBtnEl.style.visibility= 'visible'
    resetBetBtnEl.style.visibility= 'visible'
  }else if (step==='dealBtn'){
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    stayBtnEl.style.visibility= 'visible'
    hitBtnEl.style.visibility= 'visible'
    stayBtnEl.disabled= false
    hitBtnEl.disabled= false
  }else if (step==='stayBtn' || step==='player blackjack'){
    stayBtnEl.style.visibility= 'visible'
    hitBtnEl.style.visibility= 'visible'
    stayBtnEl.disabled= true
    hitBtnEl.disabled= true
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    discardBtnEl.style.visibility= 'visible'
  }else if (step==='bust' || step=== 'dealer blackjack'){
    discardBtnEl.style.visibility= 'visible'
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    stayBtnEl.style.visibility= 'visible'
    hitBtnEl.style.visibility= 'visible'
    stayBtnEl.disabled= true
    hitBtnEl.disabled= true
  }
}

function updatePlayingField(){
  playerCardsEl.replaceChildren()
  dealerCardsEl.replaceChildren()
  if (step==='card outline'){
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
  }if (step==='dealBtn' || playerCardCount<21){
    playerCardsEl.replaceChildren()
    dealerCardsEl.replaceChildren()
    let dealerfirstCard= document.createElement('div')
    dealerfirstCard.setAttribute('class', `card large back-red`)
    dealerCardsEl.appendChild(dealerfirstCard)
    let dealerCurrentCards= document.createElement('div')
    dealerCurrentCards.setAttribute('class', `card large ${dealerCards[1]}`)
    dealerCardsEl.appendChild(dealerCurrentCards)
    playerCards.forEach(function (cardName){
      let playerCurrentCards= document.createElement('div')
      playerCurrentCards.setAttribute('class', `card large ${cardName}`)
      playerCardsEl.appendChild(playerCurrentCards)
    })
  }if (playerCardCount===21 && playerCards.length>2){
    playerCardsEl.replaceChildren()
    dealerCardsEl.replaceChildren()
    let dealerfirstCard= document.createElement('div')
    dealerfirstCard.setAttribute('class', `card large back-red`)
    dealerCardsEl.appendChild(dealerfirstCard)
    let dealerCurrentCards= document.createElement('div')
    dealerCurrentCards.setAttribute('class', `card large ${dealerCards[1]}`)
    dealerCardsEl.appendChild(dealerCurrentCards)
    playerCards.forEach(function (cardName){
      let playerCurrentCards= document.createElement('div')
      playerCurrentCards.setAttribute('class', `card large ${cardName}`)
      playerCardsEl.appendChild(playerCurrentCards)
    })
  }if (playerCardCount>21 || step==='stayBtn' || step==='dealer blackjack' || step=== 'player blackjack'){
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

function handleClick(evt){
  step= 'chipBtn'
  if (playerMoney>=(parseInt(evt.target.id))){
    playerMoney-=(parseInt(evt.target.id))
    bet+=(parseInt(evt.target.id))
  }
  updateBtns()
  updateMessageBoard()
}

function resetBetHandleClick(){
  playerMoney+= bet
  bet=0
  updateMessageBoard()
  updateBtns()
}

function dealBtnHandleClick(){
  step= 'dealBtn'
  updateBtns()
  dealPlayerFirstCards()
  dealDealerFirstCards()
  updateMessageBoard()
}

function dealPlayerFirstCards(){
  for (let i=0; i<2; i++){
    let randomCard= deck[(Math.floor(Math.random()*deck.length))]
    playerCards.push(randomCard)
    discardPile.push(randomCard)
    let randomCardIdx= deck.indexOf(randomCard)
    deck.splice(randomCardIdx, 1)
    updatePlayingField()
  }
  playerTotal()
  dealerTotal()
  checkForBlackJack(playerCardCount)
}

function dealDealerFirstCards(){
  for (let i=0; i<2; i++){
    let randomCard= deck[(Math.floor(Math.random()*deck.length))]
    dealerCards.push(randomCard)
    discardPile.push(randomCard)
    let randomCardIdx= deck.indexOf(randomCard)
    deck.splice(randomCardIdx, 1)
    updatePlayingField()
  }
}

function dealPlayerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  playerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  playerTotal()
  updatePlayingField()
}

function dealDealerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  dealerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  dealerTotal()
  updatePlayingField()
}


function hitButton(){
  step= 'hitBtn'
  playerTotal()
  dealPlayerCards()
  checkForBust()
  updateMessageBoard()
  // playerHitCard.after(playerSecondCard)
}
function stayButton(){
  step= 'stayBtn'
  updateBtns()
  checkDealerCards()
  updatePlayingField()
  updateMessageBoard()
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

function checkForBust(){
  if (playerCardCount>21){
    //player busted
    playerMoney
    bet=0
    step= 'bust'
    renderInit()
  }
}

function checkForBlackJack(number){
  if (number===21 && cardsArr.length===2){
    step= 'player blackjack'
    updateBtns()
    dealerTotal()
    if (!dealerCards[1].includes('A')){
      if (dealerCardCount!== 21){
        playerMoney+= (bet*(3/2))
        bet=0
        updateMessageBoard()
        //update message congrats you got blackjack, it pays 3/2
      }else if (dealerCardCount=== 21){
        playerMoney+= bet
        bet=0
        updatePlayingField()
        updateMessageBoard()
        //update message: sorry you pushed
      }
    }else if (dealerCards[1].includes('A')){
      //ask for insurance
    }
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

function checkDealerCards(){
  dealerTotal()
  if (dealerCardCount<17){
    dealDealerCards()
  }else if (dealerCardCount>21){
    playerMoney+= (bet*2)
    bet=0
    updateMessageBoard()
  }else if (dealerCardCount===21){
    updatePlayingField()
    updateMessageBoard()
  }else{
    compareHands()
  }
}


function compareHands(){
  if (playerCardCount> dealerCardCount){
    playerMoney+= (bet*2)
    //update message board
    bet=0
  }else if (playerCardCount=== dealerCardCount){
    playerMoney+= bet
    bet=0
  }else{
    playerMoney
    bet=0
  }
  discardBtnEl.style.visibility= 'visible'
}

