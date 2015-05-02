local m = {}
local g = love.graphics

local SQUARE_SIZE = 25

m.init = function(tetris)
	love.window.setMode(#tetris.field[1] * SQUARE_SIZE, #tetris.field * SQUARE_SIZE)
end

m.figure = function(fig, x, y)
	g.setColor(2, 192, 2)
	for i = 1, #fig do
		for j = 1, #fig[i] do
			if fig[i][j] == 1 then
				g.rectangle("fill",
					(x + j - 1) * SQUARE_SIZE + 1,
					(y + i - 1) * SQUARE_SIZE + 1,
					SQUARE_SIZE - 2, SQUARE_SIZE - 2)
			end
		end
	end
end

m.field = function(field)
	m.figure(field, 0, 0) 
end

m.background = function(field)
	g.setColor(1, 32, 1)
	g.rectangle("fill", 0, 0, #field[1] * SQUARE_SIZE, #field * SQUARE_SIZE)
end

m.tetris = function(tetris)
	local f
	m.background(tetris.field)
	m.field(tetris.field)
	f = tetris.figure
	m.figure(f.f[f.rot].figure, f.x, f.y)
end

return m
