(function () {
  "use strict";
  const splicer = (index, duration) =>
    csvArray.splice(index - 1, 0, {
      isPitch: false,
      duration: duration,
    });

  let splices = [
    {989: "1/16"},
    {907: "1/16"},
    {804: "1/16"},
    {725: "1/16"},
    {718: "1/16"},
    {711: "1/16"},
    {599: "1/16"},
    {540: "1/8"},
    {505: "1/8"},
    {501: "1/16"},
    {497: "1/16"},
    {493: "1/16"},
    {489: "1/16"},
    {285: "1/8"},
    {272: "1/16"},
    {243: "1/8"},
    {239: "1/16"},
    {41: "1/16"},
  ];

  for (const pairs of splices) {
    let [key, value] = Object.entries(pairs)[0];
    console.log(key, value);
    splicer(key, value);
  }

  csvArray.forEach((e, i, a) => {
    if (e.isPitch) {
    } else {
      console.log(a[i - 1], a[i + 1]);
    }
  });
})();
