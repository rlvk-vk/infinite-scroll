const imageContainer = document.getElementById('image-container')
const content = document.getElementById('content')

const imageCount = getOptimalImageLoadCount()
const accessKey = 'n69Yd0DYN8VMy3bYIN2SUHm7g287TaFr54nUoSlixtE'
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${imageCount}`

const maxRowSpan = 3
let ready = false
let imagesLoaded = 0
let totalImages = 0

function imageLoaded() {
    imagesLoaded++

    if (imagesLoaded === totalImages) {
        ready = true
    }
}

function getOptimalImageLoadCount() {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    const cols = Math.ceil(windowWidth / 300)
    const rows = Math.ceil(windowHeight / 300)

    const optimalLoadCount = cols * rows

    // The Unsplash API supports a maximum of 30 images per request, so this is the maximum allowed image count
    return Math.min(optimalLoadCount, 30)
}

function displayPhotos(photos) {
    totalImages += photos.length

    photos.forEach((photo) => {
        const rowSpan = Math.floor(Math.random() * maxRowSpan) + 1

        const link = document.createElement('a')
        link.setAttribute('href', photo.links.html)
        link.setAttribute('target', '_blank')
        link.setAttribute('class', `row-span-${rowSpan}`)

        const image = document.createElement('img')
        image.setAttribute('src', photo.urls.small)
        image.setAttribute('title', photo.alt_description)
        image.setAttribute('alt', photo.alt_description)

        image.addEventListener('load', imageLoaded)

        link.appendChild(image)
        imageContainer.appendChild(link)
    })
}

async function getPhotos() {
    hideErrorMessage()

    try {
        const response = await fetch(apiUrl)

        displayPhotos(await response.json())
    } catch (e) {
        showErrorMessage()
    }
}

function showErrorMessage() {
    content.classList.add('error')
}

function hideErrorMessage() {
    content.classList.remove('error')
}

document.addEventListener('scroll', () => {
    const height = document.documentElement.scrollHeight
    const currentScroll = window.pageYOffset
    const windowHeight = window.innerHeight

    if (currentScroll + 1000 > (height - windowHeight) && ready) {
        ready = false

        getPhotos()
    }
})

getPhotos()
