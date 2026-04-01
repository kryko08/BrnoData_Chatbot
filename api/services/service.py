from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Any, ClassVar

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T")


class ModelService(ABC, Generic[T]):

    model: ClassVar[T]

    def __init__(self, session: AsyncSession):
        self.session = session

    @abstractmethod
    async def get_one(self, **kwargs: Any) -> T | None: ...

    @abstractmethod
    async def update_one(self, **kwargs: Any) -> T | None: ...

    @abstractmethod
    async def delete_one(self, **kwargs: Any) -> None: ...

    @abstractmethod
    async def create_one(self, **kwargs) -> T: ...


class CRUDService(ModelService[T]):

    model: ClassVar[type[T]]

    async def get_one(self, **kwargs: Any) -> T | None:
        result = await self.session.execute(select(self.model).filter_by(**kwargs))
        return result.scalar_one_or_none()

    async def get_many(self, **kwargs: Any) -> list[T]:
        result = await self.session.execute(select(self.model).filter_by(**kwargs))
        return list(result.scalars().all())

    async def create_one(self, data: dict[str, Any]) -> T:
        obj = self.model(**data)
        self.session.add(obj)
        await self.session.flush()
        await self.session.refresh(obj)
        return obj

    async def delete_one(self, **kwargs: Any) -> None:
        await self.session.execute(delete(self.model).filter_by(**kwargs))

    async def update_one(
        self, filters: dict[str, Any], data: dict[str, Any]
    ) -> T | None:
        await self.session.execute(
            update(self.model).filter_by(**filters).values(**data)
        )
        return await self.get_one(**filters)
