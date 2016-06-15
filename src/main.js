$(function(){
  function initialize(options){

    function toggleContainer(){
      var listElem=$('#rightPaneBody .inputContainer[data-type="'+$(event.target.parentElement).attr('data-type')+'"]'),
          item =$(event.target.parentElement).attr('data-type');
      if(event.target.checked){
          listElem.show();
          $('#rightPaneHeader .inputHeader[data-type="'+item+'"]').show();
          if(listElem.children().length===0){
            listElem.append(createInputType(item));
            var newElem = listElem.children().last();
            $(newElem[0].children[2]).on('click',addNew);
            $(newElem[0].children[3]).on('click',removeThis);
            updateCount(item,'+');
            $('#rightPaneBodyHeader').show();
          }
        }else{
            listElem.hide();
            $('#rightPaneHeader .inputHeader[data-type="'+item+'"]').hide();
            if($("#listContainer input:checked").length===0){
              $('#rightPaneBodyHeader').hide();
            }
        }
      }

    function removeAllOfType(){
      var item =$(event.target.parentElement).attr('data-type');
      $('#rightPaneBody .inputContainer[data-type="'+item+'"]').empty();
      $('#listContainer li[data-type="'+item+'"]').children().last().text("(0)");
      $($('#rightPaneHeader .inputHeader[data-type="'+item+'"]').children()[0]).text("(0)");
      $('#listContainer li[data-type="'+item+'"]').children()[0].click();
      sessionStorage.setItem(item,0);
    }
    function clearAll(){
      $('#searchBox').val();
      $('#rightPaneBody .inputContainer').empty();
      $('#listContainer li .inputCount').text("(0)");
      $('#rightPaneHeader .inputHeader .inputCount').text("(0)");
      $('#listContainer li input:checked').click();
      $('#rightPaneBodyHeader').hide();
      options.forEach(function(d){
        sessionStorage.setItem(d,0);
      });
    }

    var listItems="",
        headerDivs="";
        containerDivs="";
    options.forEach(function(item){
      var itemWithoutSpaces=item.replace(/\s/g,'');
      listItems+="<li data-type='"+item+"'> <input type='checkbox' id='"+itemWithoutSpaces+"' value='"+item+"'/><label for='"+itemWithoutSpaces+"' class='inputSelectorLabel'>"+item+"</label><div class='inputCount'>(0)</div></li>";
      containerDivs+="<div data-type='"+item+"' class='inputContainer'></div>";
      headerDivs+="<div class='inputHeader' data-type='"+item+"'>"+item+" <div class='inputCount'>(0)</div><div class='removeAll'>&cross;</div></div>";
      sessionStorage.setItem(item,0);
    });
    $('#listContainer').html(listItems);
    $('#rightPaneBody').html(containerDivs);
    $('#rightPaneBody .inputContainer').hide();
    $('#rightPaneHeader').html(headerDivs).children().hide();
    $('#rightPaneBodyHeader').hide();
    $('#listContainer li').on('click',toggleContainer);
    $('#rightPaneHeader .inputHeader .removeAll').on('click',removeAllOfType);
    $('.clearAll').on('click',clearAll);
  };

  var counter=-1;
  function createInputType(option){
    switch (option) {
      case "Text Box":
        return "<div class='row'><div class='rowLabel'>Text Box</div><div class='inputTypeContainer'><input type='text'/></div><div class='addNew' data-type='"+option+"'>&plus;</div><div class='removeThis'>x</div></div>"
      case "Radio":
        counter++;
        return "<div class='row'><div class='rowLabel'>Radio</div><div class='inputTypeContainer'><input type='radio' name='radio"+counter+"'/>Yes<input type='radio' name='radio"+counter+"'/>No</div><div class='addNew' data-type='"+option+"'>&plus;</div><div class='removeThis'>x</div></div>"

      case "Select Box":
        return "<div class='row'><div class='rowLabel'>Select Box</div><div class='inputTypeContainer'><select><option>Select</option></select></div><div class='addNew' data-type='"+option+"'>&plus;</div><div class='removeThis'>x</div></div>"

      case "Check Box":
        return "<div class='row'><div class='rowLabel'>Check Box</div><div class='inputTypeContainer'><input type='checkbox'/>Option 1<input type='checkbox'/>Option 2</div><div class='addNew' data-type='"+option+"'>&plus;</div><div class='removeThis'>x</div></div>"

      case "Text Area":
        return "<div class='row'><div class='rowLabel'>Text Area</div><div class='inputTypeContainer'><textarea></textarea></div><div class='addNew' data-type='"+option+"'>&plus;</div><div class='removeThis'>x</div></div>"

      case "Auto Complete":
        return "<div class='row'><div class='rowLabel'>Auto Complete</div><div class='inputTypeContainer'><input type='text' autocomplete='on' placeholder='Auto Complete'/></div><div class='addNew' data-type='"+option+"'>&plus;</div><div class='removeThis'>x</div></div>"
    }
  }




  function addNew(){
    var type=$(event.target).attr('data-type');
    var newElem = $('#rightPaneBody .inputContainer[data-type="'+type+'"]').append(createInputType(type)).children().last();
    $(newElem[0].children[2]).on('click',addNew);
    $(newElem[0].children[3]).on('click',removeThis);
    updateCount(type,"+");
  }



  function removeThis(){
    var type =$(event.target.previousSibling).attr('data-type');
    if($(event.target.parentElement).siblings().length===0){
      $(event.target.parentElement.parentElement).hide();
      $('#listContainer li[data-type="'+type+'"]').children()[0].click();
    }
    $(event.target.parentElement).remove();;
    updateCount(type,"-");
  }


  function updateCount(type,operationType){
    var currentCount=sessionStorage.getItem(type),
        listElem=$('#listContainer li[data-type="'+type+'"]').children().last();
        headerElem=$('#rightPaneHeader .inputHeader[data-type="'+type+'"]').children()[0];
        elemCount=+listElem.text().replace(/[(|)]/g,"");
    if(operationType==='+'){
      sessionStorage.setItem(type,++currentCount);
      elemCount +=1;
    }else{
      sessionStorage.setItem(type,--currentCount);
      elemCount -=1;
    }
    listElem.text("("+elemCount+")");
    $(headerElem).text("("+elemCount+")");
  }


  var optionList=['Text Box','Radio','Select Box','Check Box','Text Area','Auto Complete'];
  initialize(optionList);
  $('#searchBox').keyup(function(){
    var searchText=event.target.value.trim();
    if(searchText.length>0){
      $('#listContainer li').each(function(index,value){
        if($(this).attr('data-type').indexOf(searchText)>-1){
          $(this).show();
        }else{
          $(this).hide();
        }
      });
    } else {
      $('#listContainer li').show();
    }
  });
});
