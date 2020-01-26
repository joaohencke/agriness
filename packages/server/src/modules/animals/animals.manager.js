import AnimalModel from './animals.model';

export const list = async ({ page, limit, query }) => {
  const $find = {};

  if (query) {
    const regexp = new RegExp(query, 'gi');

    $find.$or = [{ name: { $regex: regexp } }, { locale: { $regex: regexp } }];
  }

  return AnimalModel.find($find)
    .limit(limit)
    .skip((page - 1) * limit);
};

export const get = async ({ id }) => AnimalModel.findById(id);

const create = animal => AnimalModel.create(animal);

const edit = ({ id, name, status }) => AnimalModel.findByIdAndUpdate(id, { $set: { name, status } }, { new: true });

export const put = async ({ id, ...animal }) => {
  if (id) return edit({ ...animal, id });
  return create(animal);
};

export const remove = async ({ id }) => AnimalModel.findByIdAndRemove(id);
