
// 获取容器
var container = document.getElementById("calculator");
var divs = container.getElementsByTagName("div");

// 获取屏幕中 表达式 和 输出
var expression = divs[0].getElementsByTagName("span")[0];
var output = divs[0].getElementsByTagName("span")[1];

// 获取操作符
var operators = divs[1].getElementsByTagName("a");

var clear = operators[operators.length - 3];             // 清除
var backspace = operators[operators.length - 2];         // 后退
var equal = operators[operators.length - 1];             // 等于

// 获取数字面板
var numbers = divs[2].getElementsByTagName("a");

// 获取日志容器
var ologger = container.getElementsByTagName("ul")[0];

// 日志缓存数组
var logger = [];
var index = 0;

// 开关
var flag = true;
var calculated = false;

// 开始

// 数字
for (var i = 0; i < numbers.length; i++) {

	numbers[i].onclick = function(e){

		try {
			var tar = e.target.innerHTML;
			var cur = output.innerHTML;

			if ((flag === false || calculated === true) && tar === ".") {
				output.innerHTML = "0.";
				return;
			}

			if (flag === false || calculated === true || cur === "0") {
				if (tar === "00") return;
				if (tar === ".") {
					output.innerHTML += tar;
					return;
				}
				output.innerHTML = tar;
				return;
			}

			if (tar === "." && cur.indexOf(".") !== -1) return;

			output.innerHTML += tar;

		} finally {
			if (flag === false && tar !== "00") {
				flag = true;
				return;
			}
			if (calculated === true && tar !== "00") {
				calculated = false;
				return;
			}
		}
	}

}

// 加减乘除
for (var j = 0; j < (operators.length - 3); j++) {

	operators[j].onclick = function (e) {

		var cur = expression.innerHTML;
		var tar = e.target.innerHTML;

		if (flag === true && tar === "-" && output.innerHTML === "0") {
			expression.innerHTML = expression.innerHTML !== tar? tar: "";
			output.innerHTML = "0";
			return;
		}

		if (flag === true) {
			expression.innerHTML += output.innerHTML;
			output.innerHTML = calculate(expression.innerHTML);
			expression.innerHTML += " " + tar + " ";
			flag = false;
		} else {
			var arr = cur.split("");
			arr[cur.length - 2] = tar;
			cur = arr.join("");
			expression.innerHTML = cur;
		}
	}
}

// 清除
clear.onclick = function() {
	expression.innerHTML = "";
	output.innerHTML = 0;
	lastOutput = null;
	flag = true;
}

// 后退
backspace.onclick = function() {

	var str = output.innerHTML;

	if (str === "0") return;

	if (str.length === 1){
		output.innerHTML = "0";
	} else {
		var arr = str.split("");
		arr.length -= 1;
		output.innerHTML = arr.join("");
	}
}

// 等于
equal.onclick = function() {

	if (expression.innerHTML === "") return;

	expression.innerHTML += output.innerHTML;

	output.innerHTML = calculate(expression.innerHTML);

	log(expression.innerHTML + " = " + output.innerHTML);
	expression.innerHTML = "";

	flag = true;
	calculated = true;
}

// 计算表达式，默认若数字超过12个，根据数字是否大于1e+10
// 采取指数计数法或四舍五入保留数字12个
function calculate(exp, x) {

	x = x || 12;

	var num = eval(exp.replace(/×/g,"*").replace(/÷/g,"/"));
	var str = num.toString();

	if (str.replace(/\./,"").length > x) {

		if (num < 1e+10) {

			var arr = str.split("");
			var position = str.indexOf(".");

			if (position === -1 || position > x) {
				arr[x - 1] = Number(arr[x - 1]) + (arr[x] < 5? 0: 1);
				arr.length = x;
			} else if (position === x) {
				arr[x - 1] = Number(arr[x - 1]) + (arr[x + 1] < 5? 0: 1);
				arr.length = x;
			} else if (position < x) {
				arr[x] = Number(arr[x]) + (arr[x + 1] < 5? 0: 1);
				arr.length = x + 1;
			}
			return Number(arr.join(""));

		} else {
			return num.toExponential(x-5);
		}
	}
	return num;
}

// 保存最近 10 条日志
function log(str) {

	logger.unshift(str);

	if (index < 10) {
		index++;
	} else {
		logger.length = 10;
	}

	ologger.innerHTML = "";
	for (var i = 0; i < logger.length; i++) {
		ologger.innerHTML += "<li>" + logger[i] + "</li>";
	}
}
