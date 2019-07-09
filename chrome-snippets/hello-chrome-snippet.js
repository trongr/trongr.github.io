function getImageUrls() {
  const urls = Array.from(document.querySelectorAll("img")).map(
    (img) => img.src,
  )
  console.log(urls)
}

getImageUrls()
