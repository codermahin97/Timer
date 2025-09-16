// notification process
if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission)
    })
}

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('service.js')
//     .then(()=> console.log('Service Worker registered'))
//     .then(err => console.log('SW registration failed:', err))
// }
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service.js')
    .then(reg => console.log('Merged SW registered', reg))
    .catch(err => console.log('SW registration failed', err));
}

const timer = document.querySelector('.timer')
const startButton = document.querySelector('.start-btn')
const stopButton = document.querySelector('.stop-btn')
const resetButton = document.querySelector('.reset-btn')
const hoursInput = document.querySelector('.hours')
const minutesInput = document.querySelector('.minutes')
const secondsInput = document.querySelector('.seconds')

let seconds 
let minutes
let hours
let interval = null

let initHours = 0
let initMinutes = 0
let initSeconds = 0
let audio = new Audio('fire_alarm.mp3')
audio.loop = true
// const notify = document.getElementById('notifySound')
      // Start infinite loop
      function startNotify() {
      audio.currentTime = 0
      audio.play()
      }
      // Stop when user wants
      function stopNotify() {
      audio.pause()
      audio.currentTime = 0
      }
function startCountDown(){
    if (!interval) {
        if (    
           (hoursInput.value === '' || parseInt(hoursInput.value) === 0) &&
           (minutesInput.value === '' || parseInt(minutesInput.value) === 0) &&
           (secondsInput.value === '' || parseInt(secondsInput.value) === 0)
        ) {
            alert("Please set your time before starting");
            return;
        }
        // ✅ Always reinitialize from inputs when no active countdown

        if (hours === undefined && minutes === undefined && seconds === undefined) {
            let h = parseInt(hoursInput.value) || 0
            let m = parseInt(minutesInput.value) || 0
            let s = parseInt(secondsInput.value) || 0     
            
            initHours = h
            initMinutes = m
            initSeconds = s
            hours = initHours
            minutes = initMinutes
            seconds = initSeconds

            const endTime = Date.now() + (hours*3600 + minutes*60 + seconds) * 1000
            localStorage.setItem('endTime', endTime)
        }

        // if (hours === undefined || minutes === undefined || seconds === undefined) {
        //     alert('please set your time before starting')
        //     return
        // }

        interval = setInterval(()=> {       
            seconds--
            if (seconds < 0) {
                seconds = 59
                minutes--
            }
            if (minutes < 0) {
                minutes = 59
                hours--
            }
            if (seconds === 0 && minutes === 0 && hours === 0) {
                clearInterval(interval)
                interval = null
                hours = undefined
                minutes = undefined
                seconds = undefined
                timer.textContent = '00:00:00'

                document.getElementById('pop-up').style.display = 'flex'

                // const notify = document.getElementById('notifySound')
                startNotify()

                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(' Time’s up!', {
                        body: 'Your countdown time has finished!'
                    })
                }
                else {
                    alert("time's up")
                }
                return
            }
            timer.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
        }, 1000)
    }
}
window.addEventListener('load', ()=> {
    const saveTime = localStorage.getItem('endTime')
    if (saveTime) {
        const remaining = Math.floor((saveTime - Date.now()) / 1000)

        if (remaining > 0) {
            hours = Math.floor(remaining / 3600)
            minutes = Math.floor((remaining % 3600) / 60) 
            seconds = remaining % 60
            startCountDown()
        }
        else {
            localStorage.removeItem('endTime')
        }
    }
})
function stopCountDown(){
    clearInterval(interval)
    interval = null
}

function resetCountDown(){
    clearInterval(interval)
    interval = null
    hours = undefined
    minutes = undefined
    seconds = undefined

    localStorage.removeItem('endTime')
    // timer.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
    timer.textContent = '00:00:00'
    stopNotify()
}

startButton.addEventListener('click', ()=> {
    startCountDown()
    // hoursInput.value = ''
    // minutesInput.value = ''
    // secondsInput.value = ''
    startButton.innerText = 'start'
})
stopButton.addEventListener('click', ()=> {
    stopCountDown()
    startButton.innerText = 'resume'
    // initHours = hours
    // initMinutes = minutes
    // initSeconds = seconds
})

resetButton.addEventListener('click', ()=> {
    resetCountDown()
    startButton.innerText = 'start'
    hoursInput.value = ''
    minutesInput.value = ''
    secondsInput.value = ''
})
document.getElementById('close-popup').addEventListener('click', ()=> {
    document.getElementById('pop-up').style.display = 'none'
    stopNotify()
})

const toggle = document.getElementById('theme-toggle')

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode')
    toggle.innerText = '🌙'
}
else {
    document.body.classList.remove('light-mode')
    toggle.innerText = '☀️'
}

toggle.addEventListener('click', ()=> {
    document.body.classList.toggle('light-mode')
    
    if (document.body.classList.contains('light-mode')) {
        toggle.innerText = '🌙'
        localStorage.setItem('theme', 'light')
    }
    else {
        toggle.innerText = '☀️'
        localStorage.setItem('theme', 'dark')
    }
})