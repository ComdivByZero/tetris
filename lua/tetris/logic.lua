local m = {}

local FIGURES = {
	{	{	figure = {
				{1},
				{1},
				{1},
				{1}
			}, dx = 1, dy = 0
		},
		{	figure = {
				{1, 1, 1, 1}
			}, dx = 0, dy = 1
		}
	},
	{	{	figure = {
				{1},
				{1, 1, 1}
			}, dx = 0, dy = 1
		},
		{	figure = {
				{1, 1},
				{1},
				{1}
			}, dx = 1, dy = 0
		},
		{	figure = {
				{1, 1, 1},
				{0, 0, 1}
			}, dx = 0, dy = 1
		},
		{	figure = {
				{0, 1},
				{0, 1},
				{1, 1}
			}, dx = 1, dy = 0
		}
	},
	{	{	figure = {
				{0, 0, 1},
				{1, 1, 1}
			}, dx = 0, dy = 1
		},
		{	figure = {
				{1},
				{1},
				{1, 1}
			}, dx = 1, dy = 0
		},
		{	figure = {
				{1, 1, 1},
				{1}
			}, dx = 0, dy = 1
		},
		{	figure = {
				{1, 1},
				{0, 1},
				{0, 1}
			}, dx = 1, dy = 0
		}
	},
	{	{	figure = {
				{1, 1},
				{1, 1}
			}, dx = 1, dy = 1
		}
	},
	{	{	figure = {
				{0, 1},
				{1, 1, 1}
			},
			dx = 0, dy = 1
		},
		{	figure = {
				{1},
				{1, 1},
				{1}
			},
			dx = 1, dy = 0
		},
		{	figure = {
				{1, 1, 1},
				{0, 1}
			}, dx = 0, dy = 1
		},
		{	figure = {
				{0, 1},
				{1, 1},
				{0, 1}
			}, dx = 1, dy = 0
		}
	},
	{	{	figure = {
				{0, 1},
				{1, 1},
				{1}
			}, dx = 1, dy = 0
		},
		{	figure = {
				{1, 1},
				{0, 1, 1}
			}, dx = 0, dy = 0
		}
	},
	{	{	figure = {
				{1},
				{1, 1},
				{0, 1}
			}, dx = 1, dy = 0
		},
		{	figure = {
				{0, 1, 1},
				{1, 1}
			}, dx = 0, dy = 0
		}
	}
}

local function emptyLine(width)
	local l = {}
	for i = 1, width do
		l[i] = 0
	end
	return l
end

m.create = function(width, height)
	assert(width > 3 and height > 3)
	local t = {
		field = {},
		figure = nil
	}
	for y = 1, height do
		t.field[y] = emptyLine(width)
	end
	return t
end

m.createClassic = function()
	return m.create(10, 20)
end

m.addFigure = function(tetris, index, rotate)
	local f = FIGURES[index]
	assert(f ~= nil)
	tetris.figure = {
		x = #tetris.field[1] / 2 - 2 + f[rotate].dx,
		y = 0,
		f = f,
		
		rot = rotate
	}
	return not m.isFigureCollideField(tetris.field, f[rotate].figure, tetris.figure.x, tetris.figure.y)
end

m.addFigureRandom = function(tetris)
	local r
	r = math.random(1, #FIGURES)
	return m.addFigure(tetris, r, math.random(1, #FIGURES[r]))
end

m.isFigureCollideField = function(field, figure, fx, fy)
	local function isCollide(t, y)
		local x
		x = 1
		while	x <= #t
				and (
					(t[x] == 0)
					or (
						x + fx >= 1 and x + fx <= #field[1]
						and  
						y + fy >= 1 and y + fy <= #field
						and 
						field[fy + y][fx + x] == 0
					)
				)
		do
			x = x + 1
		end
		return x <= #t
	end
	local y
	y = 1
	while y <= #figure and not isCollide(figure[y], y) do
		y = y + 1
	end
	return y <= #figure
end

m.setFigurePositionInFieldIfAble = function(field, fig, rot, dx, dy)
	local able
	dx = dx + (fig.f[rot].dx - fig.f[fig.rot].dx)
	dy = dy + (fig.f[rot].dy - fig.f[fig.rot].dy)
	able = not m.isFigureCollideField(field, fig.f[rot].figure, fig.x + dx, fig.y + dy)
	if able then
		fig.x = fig.x + dx
		fig.y = fig.y + dy
		fig.rot = rot
	end
	return able
end

m.tryToMoveCurrentFigure = function(tetris, dx, dy)
	return m.setFigurePositionInFieldIfAble(tetris.field, tetris.figure, tetris.figure.rot, dx, dy)
end

m.tryToRotateCurrentFigure = function(tetris)
	local rot
	rot = 1 + tetris.figure.rot % # tetris.figure.f
	return m.setFigurePositionInFieldIfAble(tetris.field, tetris.figure, rot, 0, 0)
end

m.embedFigureIntoField = function(field, fig)
	local x, y, f
	f = fig.f[fig.rot].figure
	for i = 1, #f do
		y = fig.y + i
		if y >= 1 and y <= #field then
			for j = 1, #f[i] do
				x = fig.x + j
				if x >= 1 and x <= #field[y] and field[y][x] == 0 then
					field[y][x] = f[i][j]
				end
			end
		end
	end
end

m.embedCurrentFigureIntoField = function(tetris)
	m.embedFigureIntoField(tetris.field, tetris.figure)
	tetris.figure = nil
end

m.searchCompletedLines = function(field)
	function fullLine(f)
		local i
		i = 1
		while i <= #f and f[i] ~= 0 do
			i = i + 1
		end
		return i > #f
	end
	local lines, j
	lines = {}
	j = 1
	for i = 1, #field do
		if fullLine(field[i]) then
			lines[j] = i
			j = j + 1
		end
	end
	return lines
end

m.removeCompletedLines = function(tetris)
	local lines
	lines = m.searchCompletedLines(tetris.field)
	for i = 1, #lines do
		table.remove(tetris.field, lines[i])
		table.insert(tetris.field, 1, emptyLine(#tetris.field[1]))
	end
end

return m
