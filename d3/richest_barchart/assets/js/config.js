const config = {

  // set the maximum numbers of bars
  max_number: 20,

  // auto sort or not
  auto_sort: true,

  // set timeformat
  timeFormat: "%Y",

  // ASC / Desc
  reverse: false,

  // set the column name to sort
  divide_by: "name",
  
  // left label
  itemLabel: "No.1",

  // right label
  typeLabel: "",
  

  //interval time of animation
  interval_time: 2,

  // 偏移量
  offset: 0,

  // show the barInfo inside bar
  display_barInfo: 1,

  // use counter or not
  use_counter: false,

  step: 1,

  // .2f mains keep two decimals.
  format: ",",

  // 
  postfix: "",

  // set the spacing of svg
  left_margin: 280,
  right_margin: 350,
  top_margin: 80,
  bottom_margin: 40,

  // change datelabel
  dateLabel_switch: true,
  // 时间标签坐标。建议x：1000 y：-50开始尝试，默认位置为x:null,y:null
  dateLabel_x: null,
  dateLabel_y: null,

  // 允许大于平均值的条消失时上浮。
  allow_up: false,

  // 设置动画效果，如果为true，则新进入的条目从0开始。
  enter_from_0: false,

  // 如果所有数字都很大，导致拉不开差距则开启此项使得坐标原点变换为（最小值）*2-（最大值）
  big_value: true,

  // set the second of wait.
  wait: 0,

  // set the animation duration
  update_rate: 1,
   
  // show label
  showLabel: true,

  
  labelx: -10,
 
  // set background color of svg.
  background_color: "#FDF2E8",
  
  // show x axis ticks
  show_x_tick: true,
  
  // limit bar info display length
  bar_name_max: 60,

  display_inside_the_bar: '', //possible values: 1.name 2.type

  display_left_of_the_bar: 'type', //possible values: 1.name 2.type 3.rank

  rank_label: {
    color: '#FFFFF' // set rank label color
  },

  bar_height: 43, //set bar heights

  //set growth text attributes on top
  growth_text:{
    font_size: 25, 
    left_text_x: 1880, 
    right_text_x: 4870,
    text_y: 800 // set growth text, champion name and counter y values
  },

  //set chempion name attributes on top
  champion_name: {
    font_size: 0,
    x: 1755,
    y: 1000
  },

  counter_size: 25, //set days count size (y is growth_text.text_y and x is calculated)
  
  //set date label attributes on bottom 
  date_label: {
    font_size: 60, 
    x: 280, // positive values -> date goes right, negative values -> date goes left
    y: 0  // positive values -> date goes down, negative values -> date goes up
  },

  player_name_size: 24, //set player name size inside the bar

  player_rank_point_size: 24, //set player rank size at the right of bar

  blur_background_image: true, // set it false if you do not want blurry effect

  animate_background_image: true // background image moving slowly (affects performance)
};