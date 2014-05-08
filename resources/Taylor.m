function [Taylor_koefs, funcs] = Taylor(func, number, interval)
%��������� �� ���� ������� (������), ���������� ����������� � �����, �
%������� ����� ���������� �����������.
%���������� ������������ �������� ������� � ������ �� �����

% 1. ��������� ������� � string
% 2. ����� �����������
% 3. ��������� ����������� � string, ��������� ����������� � lambda
% 4. ��������� �������� ����������� � ������ ������ �����, ������� ��
% ������ ���������.

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

