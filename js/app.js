//const
const chipVals= [5, 10, 25, 100]
//variables
let playerMoney, bet, dealBtn, dealerCardCount, playerCardCount
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
// const dealerFirstCard= document.getElementById("dealer-first-card")
// const dealerSecondCard= document.getElementById("dealer-second-card")
// const playerFirstCard= document.getElementById("player-first-card")
// const playerSecondCard= document.getElementById("player-second-card")
const initialCardsEl= document.querySelectorAll('#initial-cards')
const hitBtnEl= document.getElementById('hit-button')
const stayBtnEl= document.getElementById('stay-button')
const discardBtnEl= document.getElementById('discard-button')



//event-listeners
chipsEls.forEach(function(chip, idx){
  chip.innerText=`$${chipVals[idx]}`
  chip.addEventListener('click', handleClick)
})

dealBtnEl.addEventListener('click', dealBtnHandleClick)
resetBetBtnEl.addEventListener('click', resetBetHandleClick)
hitBtnEl.addEventListener('click', hitBtn)
stayBtnEl.addEventListener('click', stayBtn)
discardBtnEl.addEventListener('click', render)

//functions
function init(){
  playerMoney= 1000
  bet= 0
  deck = ["dA","dQ","dK","dJ","d10","d09","d08","d07","d06","d05","d04","d03","d02","hA","hQ","hK","hJ","h10","h09","h08","h07","h06","h05","h04","h03","h02","cA","cQ","cK","cJ","c10","c09","c08","c07","c06","c05","c04","c03","c02","sA","sQ","sK","sJ","s10","s09","s08","s07","s06","s05","s04","s03","s02"]
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
}

function updatePlayingField(){
  initialCardsEl.forEach(function(initialCard){
    let className= initialCard.getAttribute('class')
    initialCard.classList.replace(className.slice(11), 'outline')
  })
  //remove any added divs
  playerCards=[]
  dealerCards=[]
}

function handleClick(evt){
  if (!bet){
    dealBtnEl.style.visibility= 'visible'
    resetBetBtnEl.style.visibility= 'visible'
  } 
  if (playerMoney>=(parseInt(evt.target.id))){
    playerMoney-=(parseInt(evt.target.id))
    playerMoneyEl.innerText= `Money left: $${playerMoney}`
    bet+=(parseInt(evt.target.id))
    currentBetEl.innerText= `Current bet: $${bet}`
  }
}

function resetBetHandleClick(){
  init()
}

function dealBtnHandleClick(){
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  chipsEls.forEach(function(chip){
    // chip.removeEventListener('click', handleClick)
    chip.disabled= true
  })
  stayBtnEl.style.visibility= 'visible'
  hitBtnEl.style.visibility= 'visible'
  stayBtnEl.disabled= false
  hitBtnEl.disabled= false
  dealCards()
  playerTotal()
  dealerTotal()
  checkForBlackJack(playerCardCount)
}

function dealCards(){
  for (i=0; i<4; i++){
    let randomCard= deck[(Math.floor(Math.random()*deck.length))]
    discardPile.push(randomCard)
    let randomCardIdx= deck.indexOf(randomCard)
    deck.splice(randomCardIdx, 1)
    renderInitialCards(randomCard)
  }
}

function renderInitialCards(randomCard){
 if (i===0){
  initialCardsEl[2].classList.remove('outline')
  initialCardsEl[2].classList.add(randomCard)
  playerCards.push(randomCard)
 }else if (i===1){
  initialCardsEl[0].classList.remove('outline')
  initialCardsEl[0].classList.add(randomCard)
  initialCardsEl[0].classList.add('back-red')
  dealerCards.push(randomCard)
 }else if (i===2){
  initialCardsEl[3].classList.remove('outline')
  initialCardsEl[3].classList.add(randomCard)
  playerCards.push(randomCard)
 }else if (i===3){
  initialCardsEl[1].classList.remove('outline')
  initialCardsEl[1].classList.add(randomCard)
  dealerCards.push(randomCard)
 }
}

function hitBtn(){
  //add a card to player when pressed
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  playerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  const playerHitCard= document.createElement('div')
  playerHitCard.setAttribute('class', `card large ${randomCard}`)
  document.body.appendChild(playerHitCard)
  playerTotal()
  // playerHitCard.after(playerSecondCard)
}
function stayBtn(){
  initialCardsEl[0].classList.remove('back-red')
  initialCardsEl[0].classList.add(dealerCards[0])
  stayBtnEl.disabled= true
  hitBtnEl.disabled= true
  dealerTotal()
  checkDealerCards()
  compareHands()
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
  console.log(`player total: ${playerCardCount}`)
}

function checkForBlackJack(number){
  if (number===21 && cardsArr.length===2){
    stayBtnEl.disabled='true'
    hitBtnEl.disabled='true'
    dealerTotal()
    if (!dealerCards[1].includes('A')){
      if (dealerCardCount!== 21){
        playerMoney+= (bet*(3/2))
        bet=0
        //update message congrats you got blackjack, it pays 3/2
        render()
      }else if (dealerCardCount=== 21){
        playerMoney+= bet
        bet=0
        render()
        dealerFirstCard.classList.remove('back-red')
        dealerFirstCard.classList.add(dealerCards[0])
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
  console.log(`dealer total: ${dealerCardCount}`)
}

function checkDealerCards(){
  dealerTotal()
  if (dealerCardCount<17){
    //deal out cards function
    dealDealerCards()
  }else if (dealerCardCount>21){
    //pay player
    playerMoney+= (bet*2)
    bet=0
    render()
  }else{
    compareHands()
  }
}

function dealDealerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  dealerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  renderDealerCards(randomCard)
  checkDealerCards()
}

function renderDealerCards(randomCard){
  const dealerXCard= document.createElement('div')
  dealerXCard.setAttribute('class', `card large ${randomCard}`)
  document.body.appendChild(dealerXCard)
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

