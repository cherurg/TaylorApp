function [Taylor_koefs, funcs] = Taylor(func, number, interval)
%Принимает на вход функцию (лямбду), количество производных и точки, в
%которых нужно рассчитать производные.
%Возвращает коэффициенты полинома Тейлора в каждой из точек

% 1. Перевести функцию в string
% 2. Взять производную
% 3. Перевести производную в string, перевести производную в lambda
% 4. Посчитать значение производной в каждой нужной точке, поделив на
% нужный факториал.

symFromFunc = func2str(func);
temp = '';
for i = 1:(length(symFromFunc) - 4)
    temp(i) = symFromFunc(i + 4);   
end
symFromFunc = sym(temp);


stringFunctions = symFromFunc;
for i = 2:number
    stringFunctions(i) = diff(stringFunctions(i-1));
    %disp(i);
end

for i = 1:number
    temp = char(stringFunctions(i));
    funcs{i} = str2func(['@(x)', temp]);
    %disp(i);
end

Taylor_koefs = zeros(length(interval), number);
for i = 1:length(interval)
    for j = 1:number
        Taylor_koefs(i, j) = funcs{j}(interval(i))/factorial(j-1);
    end
    %disp(i);
end

end

