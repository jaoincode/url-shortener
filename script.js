const form = document.querySelector(".shorten-box");
const linkToShort = document.querySelector(".shorten-box input");
const list = document.querySelector(".url-list");
const clearBtn = document.querySelector(".clear-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!linkToShort.value) console.log("vc n passo nada burro");
  shortenLink(linkToShort.value);
  linkToShort.value = "";
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("linksData");
  list.innerHTML = ""; // clear list
  verifyClearData();
});

const shortenLink = (link) => {
  fetch(`https://api.shrtco.de/v2/shorten?url=${link}`)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      addNewLink(json);
    })
    .catch((err) => console.log(err));
};

const addNewLink = ({ result }) => {
  const shortLink = result.short_link;
  const fullShortLink = result.full_short_link;
  const originalLink = result.original_link;

  list.innerHTML += `
    <li>
      <a href=${originalLink}>${originalLink}</a>
      <a href=${fullShortLink}>${shortLink}</a>
    </li>
  `;

  storeData(shortLink, fullShortLink, originalLink);
};

const storeData = (shortLink, fullShortLink, originalLink) => {
  if (localStorage.getItem("linksData")) {
    const data = JSON.parse(localStorage.getItem("linksData"));
    data.push({ shortLink, fullShortLink, originalLink });

    localStorage.setItem("linksData", JSON.stringify(data));

    return;
  }

  const links = [];
  links.push({ shortLink, fullShortLink, originalLink });
  localStorage.setItem("linksData", JSON.stringify(links));

  verifyClearData();
};

const verifyStoredData = () => {
  if (localStorage.getItem("linksData")) {
    const data = JSON.parse(localStorage.getItem("linksData"));
    for (let i = 0; i < data.length; i++) {
      list.innerHTML += `
      <li>
        <a href=${data[i].originalLink} target="_blank">${data[i].originalLink}</a>
        <a href=${data[i].fullShortLink} target="_blank">${data[i].shortLink}</a>
      </li>
    `;
    }
  }
};

const verifyClearData = () => {
  if (!localStorage.getItem("linksData")) {
    return clearBtn.classList.add("hidden");
  }
  clearBtn.classList.remove("hidden");
};

verifyClearData();
verifyStoredData();
