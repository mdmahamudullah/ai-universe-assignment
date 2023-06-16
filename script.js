const loadData = async () => {
    const response = await fetch('https://openapi.programming-hero.com/api/ai/tools');
    const data = await response.json();
    // console.log(data.data.tools);
    compareData(data.data.tools);
}
loadData();

const compareData = (fetchedData) => {
    // check if fetchedData is larger than 6
    if (fetchedData.length > 6) {
        // slice fetchedData upto 6
        newData = fetchedData.slice(0, 6);
        // unhide see-more
        const seeMore = document.getElementById('see-more');
        seeMore.classList.remove('hidden');
    }
    else {
        // hide see-more
        const seeMore = document.getElementById('see-more');
        seeMore.classList.add('hidden');
    }
    displayData(newData);
}

const displayData = (fetchedData) => {
    // display no data found

    // display data
    const cardsContainer = document.getElementById('cards-container');
    fetchedData.forEach(data => {
        // console.log(data);
        const card = document.createElement('div');
        card.classList.add('card', 'w-96', 'bg-base-100', 'shadow-xl');
        card.innerHTML = `
        <figure><img src="${data.image}" alt="${data.name}" /></figure>
  <div class="card-body">
  <h3 class="text-lg font-semibold text-left">Features:</h3>
    <p class="text-left">${data.features[0]}</p>
    <p class="text-left">${data.features[1]}</p>
    <p class="text-left">${data.features[2]}</p>
    <div class="mt-3">
    <h2 class="card-title">${data.name}</h2>
    <p class="text-left">Date: ${data.published_in}</p>
    </div>
    <div class="card-actions justify-end">
      <button class="btn btn-outline" onclick="detailsButtonClicked(${data.id})">Details</button>
    </div>
  </div>
        `;
        cardsContainer.appendChild(card);
    });
}

// load all data by clicking see-more-button
document.getElementById('see-more-button').addEventListener('click', () => {
    // remove all cards
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.textContent = '';
    // hide see-more
    const seeMore = document.getElementById('see-more');
    seeMore.classList.add('hidden');
    // fetch from api
    const response = fetch('https://openapi.programming-hero.com/api/ai/tools');
    response.then(res => res.json())
        .then(data => {
            displayData(data.data.tools);
        })
});

const detailsButtonClicked = (id) => {
    // console.log(id);
    my_modal.showModal()
    showDetails(id);
}

const showDetails = async (id) => {
    // fetch from api by id
    if(id < 10){
        id = `0${id}`
    }
    const response = await fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`);
    const data = await response.json();
    console.log(data.data);
    // display modal data (first part)
    document.getElementById('modal-title-first').innerText = data.data.description;
    document.getElementById('modal-pricing').innerHTML = `
    <div class="bg-base-100 rounded-sm p-1">
    <p>${data.data.pricing[0].price? data.data.pricing[0].price : 'Free of Cost'}</p>
    <p class="text-success font-semibold">${data.data.pricing[0].plan}</p>
    </div>
    <div class="bg-base-100 rounded-sm p-1">
    <p>${data.data.pricing[1].price? data.data.pricing[1].price : 'Free of Cost'}</p>
    <p class="text-warning font-semibold">${data.data.pricing[1].plan}</p>
    </div>
    <div class="bg-base-100 rounded-sm p-1">
    <p>${data.data.pricing[2].price? data.data.pricing[2].price : 'Free of Cost'}</p>
    <p class="text-error font-semibold">${data.data.pricing[2].plan}</p>
    </div>
    `;
    document.getElementById('modal-features').innerHTML = `
    <h3 class="text-lg font-semibold">Features:</h3>
    <p>${data.data.features['1'].feature_name}</p>
    <p>${data.data.features['2'].feature_name}</p>
    <p>${data.data.features['3'].feature_name}</p>
    `;
    document.getElementById('modal-integrations').innerHTML = `
    <h3 class="text-lg font-semibold">Integrations:</h3>
    <p>${data.data.integrations[0]? data.data.integrations[0] : 'No Data Found'}</p>
    <p>${data.data.integrations[1]? data.data.integrations[1] : ''}</p>
    <p>${data.data.integrations[2]? data.data.integrations[2] : ''}</p>
    `;

    // display modal data (second part)
    document.getElementById('modal-second').innerHTML = `
    <figure class="px-10 pt-10">
            <img src="${data.data.image_link[0]}" alt="Modal Image" class="rounded-xl" />
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">${data.data.input_output_examples['0'].input ? data.data.input_output_examples['0'].input : 'Can you give an example?'}</h2>
            <p class="bg-primary-content text-white rounded-md px-2 py-1 absolute top-12 right-12">${data.data.accuracy.score ? calculateAccuracy(data.data.accuracy.score) : ''}</p>
            <p>${data.data.input_output_examples['0'].output ? data.data.input_output_examples['0'].output : 'No! Not Yet! Take a break!!!'}</p>
          </div>
    `;
}

// calculate accuracy
const calculateAccuracy = (data) => {
    const accuracy = data * 100;
    return `${accuracy}% Accuracy`
}

// sort by date
const sortByDate = async () => {
    // clear all cards
    const cardsContainer = document.getElementById('cards-container');
    cardsContainer.textContent = '';
    // fetch from api
    const response = await fetch('https://openapi.programming-hero.com/api/ai/tools');
    const data = await response.json();
    // sort data by date
    const sortedData = data.data.tools.sort((a, b) => {
        return new Date(b.published_in) - new Date(a.published_in);
    });
    // hide see-more
    const seeMore = document.getElementById('see-more');
    seeMore.classList.add('hidden');
    // display sorted data
    cardsContainer.textContent = '';
    displayData(sortedData);
}