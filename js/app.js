//const
const chipVals= [5, 10, 25, 100]
//variables
let playerMoney, bet, dealBtn, chipBtn, cardsOutline, hitBtn, stayBtn,dealerCardCount, playerCardCount
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
  chipVals
  dealBtn= false
  chipBtn= false
  cardsOutline= true
  hitBtn= false
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
  if (chipBtn){
    dealBtnEl.style.visibility= 'visible'
    resetBetBtnEl.style.visibility= 'visible'
  }else if (dealBtn){
    chipsEls.forEach(function(chip){
      chip.disabled= true
    })
    stayBtnEl.style.visibility= 'visible'
    hitBtnEl.style.visibility= 'visible'
    stayBtnEl.disabled= false
    hitBtnEl.disabled= false
  }
}

function updatePlayingField(){
  playerCardsEl.replaceChildren()
  dealerCardsEl.replaceChildren()
  if (cardsOutline){
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
  }if (dealBtn || hitBtn){
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
  }if (stayBtn){
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
  // initialCardsEl.forEach(function(initialCard){
  //   let className= initialCard.getAttribute('class')
  //   initialCard.classList.replace(className.slice(11), 'outline')
  // })
  // if (playerCards===[] && dealerCards===[]){
    
  // }else {
  //   dealerCardsEl.replaceChildren()
  //   playerCardsEl.replaceChildren()
  //   }
  } 

function handleClick(evt){
  chipBtn=true
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
  chipBtn= false
  dealBtn= true
  updateBtns()
  dealDealerFirstCards()
  dealPlayerFirstCards()
}

function dealPlayerFirstCards(){
  cardsOutline= false
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
  cardsOutline= false
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
  updatePlayingField()
}

function dealDealerCards(){
  let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  dealerCards.push(randomCard)
  discardPile.push(randomCard)
  let randomCardIdx= deck.indexOf(randomCard)
  deck.splice(randomCardIdx, 1)
  updatePlayingField()
}


// function dealCards(){
//   for (i=0; i<4; i++){
//     let randomCard= deck[(Math.floor(Math.random()*deck.length))]
//     discardPile.push(randomCard)
//     let randomCardIdx= deck.indexOf(randomCard)
//     deck.splice(randomCardIdx, 1)
//     renderInitialCards(randomCard)
//   }
// }

// function renderInitialCards(randomCard){
//   console.log(i)
//  if (i===0){
//   initialCardsEl[2].classList.remove('outline')
//   initialCardsEl[2].classList.add(randomCard)
//   playerCards.push(randomCard)
//  }else if (i===1){
//   initialCardsEl[0].classList.remove('outline')
//   initialCardsEl[0].classList.add(randomCard)
//   initialCardsEl[0].classList.add('back-red')
//   dealerCards.push(randomCard)
//  }else if (i===2){
//   initialCardsEl[3].classList.remove('outline')
//   initialCardsEl[3].classList.add(randomCard)
//   playerCards.push(randomCard)
//  }else if (i===3){
//   initialCardsEl[1].classList.remove('outline')
//   initialCardsEl[1].classList.add(randomCard)
//   dealerCards.push(randomCard)
//  }
// }

function hitButton(){
  dealBtn= false
  hitBtn= true
  dealPlayerCards()
  updatePlayingField()
  // let randomCard= deck[(Math.floor(Math.random()*deck.length))]
  // playerCards.push(randomCard)
  // discardPile.push(randomCard)
  // let randomCardIdx= deck.indexOf(randomCard)
  // deck.splice(randomCardIdx, 1)
  // updatePlayingField()
  // const playerHitCard= document.createElement('div')
  // playerHitCard.setAttribute('class', `card large ${randomCard}`)
  // playerCardsEl.appendChild(playerHitCard)
  playerTotal()
  // playerHitCard.after(playerSecondCard)
}
function stayButton(){
  initialCardsEl[0].classList.remove('back-red')
  initialCardsEl[0].classList.add(dealerCards[0])
  stayBtnEl.disabled= true
  hitBtnEl.disabled= true
  playerTotal()
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
      }else if (dealerCardCount=== 21){
        playerMoney+= bet
        bet=0
        initialCardsEl[0].classList.remove('back-red')
        initialCardsEl[0].classList.add(dealerCards[0])
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
  }else{
    compareHands()
  }
}

// function dealDealerCards(){
//   let randomCard= deck[(Math.floor(Math.random()*deck.length))]
//   dealerCards.push(randomCard)
//   discardPile.push(randomCard)
//   let randomCardIdx= deck.indexOf(randomCard)
//   deck.splice(randomCardIdx, 1)
//   renderDealerCards(randomCard)
//   checkDealerCards()
// }

// function renderDealerCards(randomCard){
//   const dealerXCard= document.createElement('div')
//   dealerXCard.setAttribute('class', `card large ${randomCard}`)
//   dealerCardsEl.appendChild(dealerXCard)
// }

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

