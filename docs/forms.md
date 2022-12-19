| 字段名     | 字段           |      |
| ---------- | -------------- | ---- |
| 商品名     | goods_name     |      |
| 仓库       | inventory      |      |
| 客供       | provider 是/否 |      |
| + 销售订单 | sale_order     |      |
|            |                |      |
|            |                |      |



#### Form Root

Form root will define two form. The form is also the data entity like backend server. also the form can be also behave like graphql entity.

1. **Normal Form**
- `goods_name`
  
- `inventory`
  
- `provider` ----> will change `true`/`false`
  
2. **Sale Order Form**

   - `sale_order`

#### Dependence

**`Sale Order Form`** depends on **`Normal Form`** and **`Normal Form`**'s `provider`. the generate stream depends like rxjs.pipe(form_change$, form_field_change$).

#### Render

the form render like this. most scenario one area have only one render form.

1. Render Form 1
   - **Normal Form**.`goods_name`
   - **Normal Form**.`inventory`
   - **Normal Form**.`provider`
   - **Sale Order Form**.`sale_order`

#### Parse 

##### 一对一, 即是1个表单实体对应另一个表单实体. 
- 易混淆场景解释. 
  - 上面示例是 provider 会影响到sale_order. 假如sale_order能影响到inventory. 则上面的定义则是如下
    - **Normal Form**
      - `goods_name`

      - `inventory`  ---> even though inventory form has `inventory`. This is still keep this is field

      - `provider` ----> will change `true`/`false`
    - **Sale Order Form**

      - `sale_order` ---> will change to effect inventory
    - **Inventory Form**
      - `inventory`  ---> this form field will be a virtual field. or as reverse side this is a real field but the **`Normal Form`**'s `inventory` field is virtual field.

##### 一对多, 即是1个表单实体对应另一个列表实体. 即 form arrary entity

1. **Normal Form**
   - `goods_name`

   - `inventory`

   - `provider` ----> will change `true`/`false`

2. **Sale Order Form**
   - `sale_order`
   - `sale_order`
   - `sale_order`
   - `sale_order`

##### 多对多, 即是表单均是列表表单实体. 即 form arrary entity

1. **Normal Form**
   - `goods_name`

   - `goods_name`

   - `goods_name`

2. **Sale Order Form**
   - `sale_order`
   - `sale_order`
   - `sale_order`
   - `sale_order`

多对多表单无法直接进行关联绑定. 必须实体化出一个form field进行关联绑定的原始操作

即是:

- 示例1: 


1. **Shadow Form Root**
    - `Normal Form`   ===> virtual field bind to normal form
  
2. **Normal Form**
    - `goods_name`

    - `goods_name`

    - `goods_name`
  
3. **Sale Order Form**

    - `sale_order`

    - `sale_order`

    - `sale_order`

    - `sale_order`


- 示例2
1. **Normal Form**

   goods =>                  ----> bind for  

      - `goods_name`

      - `goods_name`

      - `goods_name`


1. **Sale Order Form**
- `sale_order`
  
- `sale_order`
  
- `sale_order`
  
- `sale_order`

#### Virtual Field

virtual field diff from real field is that the virtual field can't be used by form getValue function.



### Question ?
use tags?

