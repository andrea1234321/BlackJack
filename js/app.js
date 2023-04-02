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
const dealerFirstCard= document.getElementById("dealer-first-card")
const dealerSecondCard= document.getElementById("dealer-second-card")
const playerFirstCard= document.getElementById("player-first-card")
const playerSecondCard= document.getElementById("player-second-card")
const hitBtnEl= document.getElementById('hit-button')
const stayBtnEl= document.getElementById('stay-button')



//event-listeners
chipsEls.forEach(function(chip, idx){
  chip.innerText=`$${chipVals[idx]}`
  chip.addEventListener('click', handleClick)
})

dealBtnEl.addEventListener('click', dealBtnHandleClick)
resetBetBtnEl.addEventListener('click', resetBetHandleClick)
hitBtnEl.addEventListener('click', hitBtn)
stayBtnEl.addEventListener('click', stayBtn)


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
  updateBtnVisibility()
}

function updateMessageBoard(){
  playerMoneyEl.innerText= `Total Money: $${playerMoney}`
  currentBetEl.innerText= `Current bet: $${bet}`
}

function updateBtnVisibility(){
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  hitBtnEl.style.visibility= 'hidden'
  stayBtnEl.style.visibility= 'hidden'
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

function dealBtnHandleClick(){
  dealBtnEl.style.visibility= 'hidden'
  resetBetBtnEl.style.visibility= 'hidden'
  chipsEls.forEach(function(chip){
    // chip.removeEventListener('click', handleClick)
    chip.disabled='true'
  })
  dealPlayerFirstCard()
  dealDealerFirstCard()
  dealPlayerSecondCard()
  dealDealerSecondCard()
  stayBtnEl.style.visibility= 'visible'
  hitBtnEl.style.visibility= 'visible'
  // dealCards()
  playerTotal()
  dealerTotal()
  checkForBlackJack(playerCardCount)
}

function resetBetHandleClick(){
  init()
}

function dealPlayerFirstCard(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  // let randomCard= deck[0]
  playerCards.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  renderPlayerFirstCard(randomCard)
}

function renderPlayerFirstCard(randomCard){
  playerFirstCard.classList.remove('outline')
  playerFirstCard.classList.add(randomCard)
}

function dealDealerFirstCard(){
  // let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  let randomCard= deck[0]
  dealerCards.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  renderDealerFirstCard(randomCard)
}

function renderDealerFirstCard(randomCard){
  dealerFirstCard.classList.remove('outline')
  dealerFirstCard.classList.add(randomCard)
  dealerFirstCard.classList.add('back-red')
}

function dealPlayerSecondCard(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  // let randomCard= deck[1]
  playerCards.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  renderPlayerSecondCard(randomCard)
}

function renderPlayerSecondCard(randomCard){
  playerSecondCard.classList.remove('outline')
  playerSecondCard.classList.add(randomCard)
}

function dealDealerSecondCard(){
  // let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  let randomCard= deck[11]
  dealerCards.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  renderDealerSecondCard(randomCard)
}

function renderDealerSecondCard(randomCard){
  dealerSecondCard.classList.remove('outline')
  dealerSecondCard.classList.add(randomCard)
}

// function dealCards(){
//   for (i=0; i<5; i++){
//     let randomCard= deck[(Math.floor(Math.random()*deck.length))]
//     playerCards.push(randomCard)
//     let randomCardIdx= deck.indexOf(randomCard)
//     deck.splice(randomCardIdx, 1)
//     if (i===0){
//       rendercDealerFirstCard(randomCard)
//     }
//   }
// }

function hitBtn(){
  //add a card to player when pressed
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  playerCards.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  const playerHitCard= document.createElement('div')
  playerHitCard.setAttribute('class', `card large ${randomCard}`)
  document.body.appendChild(playerHitCard)
  playerTotal()
  // playerHitCard.after(playerSecondCard)
}
function stayBtn(){
  dealerFirstCard.classList.remove('back-red')
  dealerFirstCard.classList.add(dealerCards[0])
  stayBtnEl.disabled='true'
  hitBtnEl.disabled='true'
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
    playerMoney+= bet*2
    bet=0
    render()
  }else{
    compareHands()
  }
}

function dealDealerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  dealerCards.push(randomCard)
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

}