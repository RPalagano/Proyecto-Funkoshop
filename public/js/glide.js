new Glide('.glide', {
    type: 'carousel',
    startAt: 0,
    perView: 3,
    breakpoints: {
        940: {
            perView: 2
        },
        650: {
            perView: 1
        }
    }
  }).mount()