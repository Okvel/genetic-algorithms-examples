# General Information
Laboratory works for BSUIR magistracy students. The goal of the laboratory works was study basic genetic algorithms concepts. Also intermediate results should be displade on the chart.
There are three tasks:
1. The search for extremum of a function of one variable using genetic algorithms with a binary representation of individuals.
1. The search for the extremum of a function of two variables using genetic algorithms with the representation of individuals in the form of real numbers.
1. Solving combinatorial optimization problems by the example of the traveling salesman problem using a genetic algorithm.
## The first laboratory work
The task is implement application which will calculate minimum of function *f* using genetic algorithm with a binary representation of individuals.
![Function *f* and it limits](/img/task-1.PNG)
An initial population is randomly generated. Next methods are implemented in laboratory work: 
* ranking is used to select parents;
* single point crossover;
* classical mutation algorithm;
* the *N* best individuals are used as new generation.
## The second laboratory work
The task is implement application which will implement calculation minimum of the 6th Schaeffer function using genetic algorythm with the representation of individuals in the form of real numbers.
![The 6th Schaeffer function and it limits](/img/task-2.PNG)
An initial population is randomly generated. Next methods are implemented in laboratory work:
* ranking is used to select parents;
* intermediate crossover;
* homogeneous mutation;
* the *N* best individuals are used as new generation.
## The third laboratory work
The task is implement application which will solve the traveling salesman problem using a genetic algorithm.
An initial population is randomly generated. City coordinates are stored in file in *test* directory. Representation of ways and cyclic crossover are used to implement task.
# How to launch
To launch application you can open file **home.html** and press button with number of laboratory work or just open **lab1.html**, **lab2.html** or **lab3.html** file.
# Details
Application was created using JavaScript and next libraries:
* jQuery;
* material design light;
* plotly
