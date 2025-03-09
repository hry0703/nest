import { AppDataSource } from "./data-source";
import { Category } from "./entity/category";
// import { Order } from "./entity/order";
// import { Role } from "./entity/role";
// import { Profile } from "./entity/Profile";
// import { User } from "./entity/user";

AppDataSource.initialize().then(async connection => {
    const categoryRespository = connection.getTreeRepository(Category)
    const root = new  Category()
    root.name = 'root'
    await categoryRespository.save(root)

    const child1 = new  Category()
    child1.name = 'child1'
    child1.parent = root
    await categoryRespository.save(child1)

    const grandChild1 = new  Category()
    grandChild1.name = 'child1-grandChild1'
    grandChild1.parent = child1
    await categoryRespository.save(grandChild1)


    const child2 = new  Category()
    child2.name = 'child2'
    child2.parent = root
    await categoryRespository.save(child2)


    // 查询所有的分类
    const find = await categoryRespository.find()
    console.log('find',find);
    // 查询分类树
    const findTrees = await categoryRespository.findTrees()
    console.log('findTrees',findTrees);
    // 查询根分类
    const findRoots = await categoryRespository.findRoots()
    console.log('findRoots',findRoots);
    // 查询祖先树
    const findAncestorsTree = await categoryRespository.findAncestorsTree(grandChild1)
    console.log('findAncestorsTree',findAncestorsTree);
    // 查询祖先
    const findAncestors = await categoryRespository.findAncestors(grandChild1)
    console.log('findAncestors',findAncestors);
    // 查询后代树
    const findDescendantsTree = await categoryRespository.findDescendantsTree(root)
    console.log('findDescendantsTree',findDescendantsTree);
    // 查询后代
    const findDescendants = await categoryRespository.findDescendants(root)
    console.log('findDescendants',findDescendants);
    // 查询后代数量
    const countDescendants = await categoryRespository.countDescendants(root)
    console.log('countDescendants',countDescendants);
    // 查询祖先数量
    const countAncestors = await categoryRespository.countAncestors(grandChild1)
    console.log('countAncestors',countAncestors);
    


}).finally(()=>process.exit(0)) // 关闭数据库连接