'use client';

import { Category } from '@prisma/client';

import {
  FcEngineering,
  FcFilmReel,
  FcMusic,
  FcMultipleDevices,
  FcSalesPerformance,
  FcOldTimeCamera,
  FcSportsMode,
} from 'react-icons/fc';
import { CgWebsite } from 'react-icons/cg';
import { CiMobile1 } from 'react-icons/ci';
import { GiMaterialsScience } from 'react-icons/gi';
import { PiBrainBold } from 'react-icons/pi';
import { GiBrain } from 'react-icons/gi';
import { SiHiveBlockchain } from 'react-icons/si';
import { SiSecurityscorecard } from 'react-icons/si';
import { AiOutlineCloudServer } from 'react-icons/ai';
import { SiJfrogpipelines } from 'react-icons/si';
import { TbHeartRateMonitor } from 'react-icons/tb';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { GiTeamIdea } from 'react-icons/gi';
import { LiaLanguageSolid } from 'react-icons/lia';

import { IconType } from 'react-icons/lib';
import CategoryItem from './CategoryItem';

interface CategoriesProps {
  items: Category[];
}

const iconMapper: Record<Category['name'], IconType> = {
  Accounting: FcSalesPerformance,
  'Artificial Intelligence': GiBrain,
  Blockchain: SiHiveBlockchain,
  'Career Development': GiTeamIdea,
  'Cloud Computing': AiOutlineCloudServer,
  'Computer Science': FcMultipleDevices,
  Cybersecurity: SiSecurityscorecard,
  'Data Science': GiMaterialsScience,
  DevOps: SiJfrogpipelines,
  Engineering: FcEngineering,
  Entrepreneurship: GiTeamIdea,
  Filming: FcFilmReel,
  Finance: FaMoneyBillTrendUp,
  Fitness: FcSportsMode,
  Language: LiaLanguageSolid,
  'Machine Learning': PiBrainBold,
  'Mobile Development': CiMobile1,
  Music: FcMusic,
  Photography: FcOldTimeCamera,
  Sports: FcSportsMode,
  'UI/UX Design': TbHeartRateMonitor,
  'Web Development': CgWebsite,
};

export default function Categories({ items }: CategoriesProps) {
  return (
    <div className='flex items-center gap-x-2 overflow-x-auto pb-2'>
      {items.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMapper[category.name]}
          value={category.id}
        />
      ))}
    </div>
  );
}
