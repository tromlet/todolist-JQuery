// Shorthand for $( document ).ready()
$(() => {
  console.log( "ready!" );
  $('button').click(function () {
    alert("jQuery alert!");
  });
});
