import data from './data.json' assert {type: 'json'};
var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)
var PLAYER_STORAGE_KEY = 'F8_PLAY'
var player = $(".player")
var heading = $("header h2")
var cdThumb = $(".cd-thumb")
var audio = $("#audio")
const cd = $(".cd")
var playBtn = $(".btn-toggle-play")
var progress = $("#progress")
var nextBtn = $(".btn-next")
var prevBtn = $(".btn-prev")
var randomBtn = $(".btn-random")
var repeatBtn = $(".btn-repeat")
var playList = $(".playlist")
var randomList = $(".load_list")
console.log(randomList);
console.log()
const app = {
  songs: data,
  currentIndex: 0,
  stopCurrentIndex: 9,
  startCurrentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  render: function () {

    var htmls = []
    var i = 0;
    htmls.push(
      `
      <div class="song index-0 active">
        <div class="thumb" style="background-image: url('${this.songs.data.song[i].thumbnail}')">
        </div>
        <div class="body">
          <h3 class="title">${this.songs.data.song[i].title}</h3>
          <p class="author">${this.songs.data.song[i].performer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `
    )
    var x = i+10
    for (i = 1; i <10; i++) {
      htmls.push(`
        <div class="song index-${i}">
        <div class="thumb" style="background-image: url('${this.songs.data.song[i].thumbnail}')">
        </div>
        <div class="body">
          <h3 class="title">${this.songs.data.song[i].title}</h3>
          <p class="author">${this.songs.data.song[i].performer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `)
    }
    playList.innerHTML = htmls.join("")
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs.data.song[this.currentIndex]
      }
    })
  },
  handleEvents: function () {
    // set size CD
    var _this = this;
    var cdWidth = cd.offsetWidth
    // Round Cd
    var cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 10000,
      interations: Infinity
    })
    cdThumbAnimate.pause()
    document.onscroll = function () {
      var newCdWidth = cdWidth - window.scrollY
      cd.style.width = newCdWidth < 0 ? 0 : newCdWidth + "px"
      cd.style.opacity = newCdWidth / cdWidth
    }
    // Set play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause()
        cdThumbAnimate.pause()

      } else {
        audio.play()
        cdThumbAnimate.play()

      }
      // Is play?
      audio.onplay = function () {
        _this.isPlaying = true
        player.classList.add("playing")

      }
      audio.onpause = function () {
        _this.isPlaying = false
        player.classList.remove("playing")

      }


    }
    // Where time play?
    audio.ontimeupdate = function () {
      // console.log(audio.currentTime / audio.duration *100)
      progress.value = audio.currentTime / audio.duration * 100

    }
    progress.title = "acd"
    progress.oninput = function (e) {
      audio.currentTime = audio.duration / 100 * progress.value


    }
    // Next Song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }

      audio.play()
      _this.scrollToActiveSong()

    }
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.prevSong()
      }

      audio.play()
      _this.scrollToActiveSong()
    }
    // repeat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      _this.setConfig('isRepeat',_this.isRepeat)
      repeatBtn.classList.toggle("active", _this.isRepeat)
    },
      randomBtn.onclick = function (e) {
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom',_this.isRandom)
        randomBtn.classList.toggle("active", _this.isRandom)
      }
      randomList.onclick = function(){
        _this.randomDanhSach()
      }
    // Repeat audio
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }
    playList.onclick = function (e) {
      var songNode = e.target.closest(".song:not(.active)");

      if (!e.target.closest(".option") && songNode) {
        // console.log("1")
      }
      if (songNode) {
        var className = songNode.className
        var index = className.indexOf("-")
        // console.log(songNode.className.slice(index + 1));
        $(`.index-${_this.currentIndex}`).classList.remove("active")
        _this.currentIndex = Number(songNode.className.slice(index + 1))
        $(`.index-${_this.currentIndex}`).classList.add("active")
        _this.loadCurrentSong()
        audio.play()
      }


    }

  },
  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 1)
  },

  loadCurrentSong: function () {

    heading.textContent = this.currentSong.title
    try {
      cdThumb.style.backgroundImage = `url("${this.currentSong.album.thumbnail_medium}")`
    } catch {
      cdThumb.style.backgroundImage = `url("${this.currentSong.thumbnail}")`

    }
    audio.src = `http://api.mp3.zing.vn/api/streaming/audio/${this.currentSong.id}/320`
    console.log(audio.src)

  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  nextSong: function () {
    console.log(this.currentIndex);

    try{
      $(`.index-${this.currentIndex}`).classList.remove("active")
    }catch{
      
    }
    // var x = Number(this.currentIndex) +10
    // console.log(x);
    this.currentIndex++
    if (this.currentIndex > this.stopCurrentIndex) {
      this.currentIndex = this.startCurrentIndex
    }
    $(`.index-${this.currentIndex}`).classList.add("active")

    this.loadCurrentSong()
  },
  prevSong: function () {
    // this.currentIndex--
    console.log(this.currentIndex);
    try{
    $(`.index-${this.currentIndex}`).classList.remove("active")
    }catch{

    }
    var x = this.startCurrentIndex
    var y = this.stopCurrentIndex 
    // console.log(x,y);
    
    this.currentIndex--
    if (this.currentIndex < x) {
      this.currentIndex = y
    }
    $(`.index-${this.currentIndex}`).classList.add("active")

    this.loadCurrentSong()

  },
  randomDanhSach: function () {
    var htmls = []
    var random 
    do{
      random = Math.floor(Math.random() * 100)
    }while(random>90)
    this.currentIndex = random
    this.startCurrentIndex = random
    this.stopCurrentIndex =random +10
    // console.log(this.stopCurrentIndex);
    console.log(this.currentIndex );

    for (var i = this.currentIndex; i <this.stopCurrentIndex; i++) {
      // random = 
      htmls.push(`
        <div class="song index-${i}">
        <div class="thumb" style="background-image: url('${this.songs.data.song[i].thumbnail}')">
        </div>
        <div class="body">
          <h3 class="title">${this.songs.data.song[i].title}</h3>
          <p class="author">${this.songs.data.song[i].performer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        `)
    }
    playList.innerHTML = htmls.join("")
    $(`.index-${this.currentIndex}`).classList.add("active")

  },
  playRandomSong: function () {
    var newIndex
    $(`.index-${this.currentIndex}`).classList.remove("active")
    do {
      var newIndex = Math.floor(Math.random() * (this.stopCurrentIndex - this.startCurrentIndex)+ this.startCurrentIndex)
    } while (newIndex == this.currentIndex)
    this.currentIndex = newIndex
    $(`.index-${newIndex}`).classList.add("active")
    console.log(newIndex)
    this.loadCurrentSong()
  },

  start: function () {
    // Assign the config
    this.loadConfig()
    // Define property
    this.defineProperties()
    // Handle event
    this.handleEvents()
    // Load song
    this.loadCurrentSong()
    // Render playlist
    this.render()
    randomBtn.classList.toggle("active", this.isRandom)
    repeatBtn.classList.toggle("active", this.isRepeat)

  }
}
app.start()
