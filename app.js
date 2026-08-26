const tg = window.Telegram.WebApp;

async function loadForm() {
  const config = await fetch("questions.json").then(r => r.json());
  document.getElementById("title").textContent = config.title;

  const form = document.getElementById("form");

  config.fields.forEach(f => {
    const label = document.createElement("label");
    label.textContent = f.label;
    form.appendChild(label);

    if (f.type === "select") {
      const select = document.createElement("select");
      select.id = f.id;

      f.options.forEach(opt => {
        const o = document.createElement("option");
        o.textContent = opt;
        select.appendChild(o);
      });

      form.appendChild(select);
    }

    // сюда легко добавляются новые типы:
    // input, checkbox, radio, textarea, rating...
  });

  window.formConfig = config;
}

loadForm();

function send() {
  const data = {};
  window.formConfig.fields.forEach(f => {
    data[f.id] = document.getElementById(f.id).value;
  });

  const payload = {
    version: window.formConfig.version,
    answers: data,
    initData: tg.initData
  };

  fetch("https://77.239.106.188/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(res => {
    console.log("Saved:", res);
    tg.close();
  })
  .catch(err => console.error(err));
}
