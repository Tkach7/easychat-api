.PHONY: up down logs prisma

# Local
up:
		docker-compose up -d

down:
		docker-compose down

logs:
		docker-compose logs -f -t

# Production
prod:
		docker-compose -f docker-compose.prod.yml up -d

prod-logs:
		docker-compose -f docker-compose.prod.yml logs -f -t

prod-down:
		docker-compose -f docker-compose.prod.yml down
