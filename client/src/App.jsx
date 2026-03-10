import React, { useState } from 'react';
import { 
  Button, Form, Input, InputNumber, Select, DatePicker, Card, Table, Tag, Space, 
  Alert, Spin, Divider, Typography, Row, Col, Tabs, List, Avatar, Badge, Empty,
  Timeline, Modal, Slider, Segmented, Descriptions, Statistic
} from 'antd';
import { 
  SearchOutlined, CalculatorOutlined, DollarOutlined, EnvironmentOutlined,
  CalendarOutlined, FireOutlined, StarOutlined, TrophyOutlined, RightOutlined,
  ClockCircleOutlined, BankOutlined, CarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// 机场/目的地代码选项（国内）
const AIRPORTS = {
  SHA: '上海', PEK: '北京', CAN: '广州', SZX: '深圳', CTU: '成都',
  HGH: '杭州', SYX: '三亚', CSX: '长沙', DLC: '大连', KMG: '昆明',
  XMN: '厦门', CKG: '重庆', LXA: '大理', JZH: '九寨沟', NKG: '南京',
  TSN: '天津', SHE: '沈阳', WHH: '武汉', XIY: '西安', ZUH: '珠海'
};

// 目的地选项（国内+国外）
const ALL_DESTINATIONS = [
  // 国内
  { code: 'SYX', name: '三亚', city: '三亚', country: '国内' },
  { code: 'CTU', name: '成都', city: '成都', country: '国内' },
  { code: 'PEK', name: '北京', city: '北京', country: '国内' },
  { code: 'SHA', name: '上海', city: '上海', country: '国内' },
  { code: 'SZX', name: '深圳', city: '深圳', country: '国内' },
  { code: 'CAN', name: '广州', city: '广州', country: '国内' },
  { code: 'HGH', name: '杭州', city: '杭州', country: '国内' },
  { code: 'XMN', name: '厦门', city: '厦门', country: '国内' },
  { code: 'KMG', name: '昆明', city: '昆明', country: '国内' },
  { code: 'DLC', name: '大连', city: '大连', country: '国内' },
  { code: 'LXA', name: '拉萨', city: '拉萨', country: '国内' },
  { code: 'CKG', name: '重庆', city: '重庆', country: '国内' },
  { code: 'XIY', name: '西安', city: '西安', country: '国内' },
  { code: 'NKG', name: '南京', city: '南京', country: '国内' },
  { code: 'HKG', name: '香港', city: '香港', country: '国内' },
  // 日本
  { code: 'TYO', name: '东京', city: '东京', country: '日本' },
  { code: 'OSA', name: '大阪', city: '大阪', country: '日本' },
  { code: 'OKA', name: '冲绳', city: '冲绳', country: '日本' },
  // 韩国
  { code: 'ICN', name: '首尔', city: '首尔', country: '韩国' },
  { code: 'CJU', name: '济州岛', city: '济州岛', country: '韩国' },
  // 东南亚
  { code: 'BKK', name: '曼谷', city: '曼谷', country: '泰国' },
  { code: 'HKT', name: '普吉', city: '普吉岛', country: '泰国' },
  { code: 'SIN', name: '新加坡', city: '新加坡', country: '新加坡' },
  // 欧美
  { code: 'NYC', name: '纽约', city: '纽约', country: '美国' },
  { code: 'LAX', name: '洛杉矶', city: '洛杉矶', country: '美国' },
  { code: 'LON', name: '伦敦', city: '伦敦', country: '英国' },
  { code: 'PAR', name: '巴黎', city: '巴黎', country: '法国' }
];

// 目的地类别
const PREFERENCES = [
  { label: '🏖️ 海岛', value: '海岛' },
  { label: '🏙️ 城市', value: '城市' },
  { label: '🏔️ 风景', value: '风景' },
  { label: '🏛️ 历史', value: '历史' }
];

// 地区筛选
const REGIONS = [
  { label: '🌍 全部', value: 'all' },
  { label: '🇨🇳 国内', value: '国内' },
  { label: '🇯🇵 日本', value: '日本' },
  { label: '🇰🇷 韩国', value: '韩国' },
  { label: '🇹🇭 泰国', value: '泰国' },
  { label: '🇸🇬 新加坡', value: '新加坡' },
  { label: '🇺🇸 美国', value: '美国' },
  { label: '🇬🇧 欧洲', value: '欧洲' }
];

function App() {
  const [activeTab, setActiveTab] = useState('recommend');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendResult, setRecommendResult] = useState(null);
  const [hotResult, setHotResult] = useState(null);
  const [dateResult, setDateResult] = useState(null);
  const [flightResult, setFlightResult] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(null);
  
  const [recommendForm] = Form.useForm();
  const [dateForm] = Form.useForm();
  const [flightForm] = Form.useForm();

  // 根据地区筛选目的地
  const getFilteredDestinations = (region) => {
    if (region === 'all') return ALL_DESTINATIONS;
    if (region === '欧洲') return ALL_DESTINATIONS.filter(d => ['英国', '法国', '意大利', '德国', '西班牙'].includes(d.country));
    return ALL_DESTINATIONS.filter(d => d.country === region);
  };

  const filteredDestinations = getFilteredDestinations(selectedRegion);

  // ==================== 详细行程推荐 ====================
  const handleRecommend = async () => {
    try {
      const values = await recommendForm.validateFields();
      setLoading(true);
      setError(null);
      setSelectedDestination(null);
      
      // 计算请假天数
      let days = values.days;
      if (values.departureDate && values.returnDate) {
        days = values.returnDate.diff(values.departureDate, 'day') + 1;
      }
      
      // 如果有出发日期但没有请假天数，则使用出发/返程日期计算
      if (!days && values.departureDate && values.returnDate) {
        days = values.returnDate.diff(values.departureDate, 'day') + 1;
      }
      
      // 如果仍然没有天数，设为默认值
      days = days || 3;
      
      const response = await axios.post('/api/trips/recommend', {
        budget: values.budget,
        days: days,
        origin: values.origin,
        destination: values.destination,
        departureDate: values.departureDate ? values.departureDate.format('YYYY-MM-DD') : null,
        returnDate: values.returnDate ? values.returnDate.format('YYYY-MM-DD') : null,
        dailySalary: values.dailySalary || 500,
        workHours: values.workHours || 8,
        leaveHours: values.leaveHours || days * (values.workHours || 8)
      });
      
      setRecommendResult(response.data);
      
      // 如果有推荐目的地，默认选中第一个
      if (response.data.recommendations?.length > 0) {
        setSelectedDestination(response.data.recommendations[0]);
      }
    } catch (err) {
      console.error('推荐错误:', err);
      setError(err.response?.data?.error || err.message || '请填写所有必填项');
    } finally {
      setLoading(false);
    }
  };

  // 加载热门目的地
  const loadHotDestinations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/destinations/hot?limit=10');
      setHotResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'hot') {
      loadHotDestinations();
    }
  }, [activeTab]);

  // 日期优化
  const handleDateOptimize = async () => {
    try {
      const values = await dateForm.validateFields();
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/dates/optimal', {
        origin: values.origin,
        destination: values.destination,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        dailySalary: values.dailySalary || 500,
        leaveHours: values.leaveHours || 8
      });
      
      setDateResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 机票查询
  const handleFlightSearch = async () => {
    try {
      const values = await flightForm.validateFields();
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/trips/full', {
        origin: values.origin,
        destination: values.destination,
        dateRange: values.dateRange ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')] : null,
        dailySalary: values.dailySalary || 500,
        workHours: values.workHours || 8,
        leaveHours: values.leaveHours || 8
      });
      
      setFlightResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 渲染航班卡片
  const renderFlightCard = (flight, type) => {
    if (!flight) return null;
    return (
      <Card 
        size="small" 
        style={{ marginBottom: 8 }}
      >
        <Row gutter={12} align="middle">
          <Col xs={24} md={type === 'outbound' ? 10 : 10}>
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>{type === 'outbound' ? '🛫 去程' : '🛬 返程'}</Text>
              <Text strong style={{ fontSize: 18 }}>{flight.flightNo}</Text>
              <Text type="secondary">{flight.airline}</Text>
            </Space>
          </Col>
          <Col xs={12} md={4}>
            <Text strong style={{ fontSize: 16 }}>{flight.departTime}</Text>
            <br />
            <Text type="secondary">T{flight.terminal}</Text>
          </Col>
          <Col xs={12} md={4}>
            <Text type="secondary"><ClockCircleOutlined /> {flight.duration}</Text>
            <br />
            <Text type="secondary">→</Text>
          </Col>
          <Col xs={12} md={4}>
            <Text strong style={{ fontSize: 16 }}>{flight.arriveTime}</Text>
            <br />
            <Text type="secondary">{flight.date}</Text>
          </Col>
          <Col xs={12} md={2}>
            <Text strong style={{ fontSize: 18, color: '#52c41a' }}>¥{Math.round(flight.price)}</Text>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染推荐结果
  const renderRecommendResult = () => {
    if (!recommendResult) return <Empty description="输入预算和天数，获取详细行程推荐" />;
    
    const { leaveCost, recommendations } = recommendResult;
    
    return (
      <div>
        {/* 请假成本摘要 */}
        <Card style={{ marginBottom: 16, background: '#f0f5ff' }}>
          <Row gutter={16} align="middle">
            <Col>
              <Statistic 
                title="请假成本" 
                value={leaveCost.totalCost} 
                prefix="¥"
                valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
              />
            </Col>
            <Col>
              <Text type="secondary">
                ({leaveCost.formula})
              </Text>
            </Col>
          </Row>
        </Card>
        
        {/* 推荐目的地列表 */}
        {recommendations.map((rec, idx) => (
          <Card 
            key={idx}
            title={
              <Space>
                <Text strong style={{ fontSize: 16 }}>
                  {rec.destination.name || rec.destination}
                </Text>
                <Tag>{rec.destination.country || '国内'}</Tag>
                {rec.destination.category && <Tag>{rec.destination.category}</Tag>}
              </Space>
            }
            extra={
              <Space>
                <Text type="secondary">去程: {rec.departureDate}</Text>
                <Text type="secondary">返程: {rec.returnDate}</Text>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            {/* 目的地信息 */}
            <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="热度">
                <Tag color="orange">{rec.destination.popularity}%</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最佳季节">{rec.destination.bestSeason}</Descriptions.Item>
              <Descriptions.Item label="预计花费">
                <Text strong>¥{rec.destination.estimatedCost?.total || rec.destination.avgPrice}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="标签">
                {rec.destination.tags?.map(t => <Tag key={t}>{t}</Tag>)}
              </Descriptions.Item>
            </Descriptions>
            
            {/* 往返最优方案 */}
            {rec.roundTrip?.optimal && (
              <Card size="small" style={{ marginBottom: 16, background: '#f6ffed', borderColor: '#52c41a' }}>
                <Badge.Ribbon text="往返最优" color="green">
                  <div>
                    <Title level={5} style={{ margin: 0 }}>💰 总成本最低方案</Title>
                    <Row gutter={16} style={{ marginTop: 12 }}>
                      <Col span={8}>
                        <Statistic 
                          title="去程票价" 
                          value={rec.roundTrip.optimal.outboundPrice} 
                          prefix="¥" 
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="返程票价" 
                          value={rec.roundTrip.optimal.returnPrice} 
                          prefix="¥" 
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic 
                          title="总价（含请假）" 
                          value={rec.roundTrip.optimal.totalCost} 
                          prefix="¥"
                          valueStyle={{ color: '#52c41a', fontSize: 24 }}
                        />
                      </Col>
                    </Row>
                  </div>
                </Badge.Ribbon>
              </Card>
            )}
            
            <Divider orientation="left">✈️ 去程航班</Divider>
            {rec.roundTrip?.optimal && renderFlightCard(rec.roundTrip.optimal.outbound, 'outbound')}
            {rec.outboundFlights?.slice(0, 3).map((flight, fIdx) => (
              <div key={fIdx}>
                {renderFlightCard(flight, 'outbound')}
              </div>
            ))}
            
            <Divider orientation="left">✈️ 返程航班</Divider>
            {rec.roundTrip?.optimal && renderFlightCard(rec.roundTrip.optimal.return, 'return')}
            {rec.returnFlights?.slice(0, 3).map((flight, fIdx) => (
              <div key={fIdx}>
                {renderFlightCard(flight, 'return')}
              </div>
            ))}
            
            {/* 更多选项 */}
            <Card size="small" style={{ marginTop: 16, background: '#fafafa' }} title="其他方案">
              {rec.roundTrip?.cheapestRoundTrip && (
                <Row gutter={16} style={{ marginBottom: 8 }}>
                  <Col>
                    <Text>💎 最便宜往返：</Text>
                    <Text strong>¥{rec.roundTrip.cheapestRoundTrip.totalCost}</Text>
                    <Text type="secondary"> ({rec.roundTrip.cheapestRoundTrip.outbound.flightNo} + {rec.roundTrip.cheapestRoundTrip.return.flightNo})</Text>
                  </Col>
                </Row>
              )}
              {rec.roundTrip?.earliestRoundTrip && (
                <Row>
                  <Col>
                    <Text>⏰ 最早航班：</Text>
                    <Text strong>¥{rec.roundTrip.earliestRoundTrip.totalCost}</Text>
                    <Text type="secondary"> ({rec.roundTrip.earliestRoundTrip.outbound.flightNo} + {rec.roundTrip.earliestRoundTrip.return.flightNo})</Text>
                  </Col>
                </Row>
              )}
            </Card>
          </Card>
        ))}
      </div>
    );
  };

  // 渲染日期优化结果
  const renderDateResult = () => {
    if (!dateResult) return <Empty description="选择日期范围，获取最优出行日期" />;
    
    const { optimal, recommendations: recs, analysis } = dateResult;
    
    return (
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <Card title="🎯 最优推荐" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Title level={2} style={{ margin: 0 }}>{optimal.date}</Title>
              <Text type="secondary">{optimal.dayOfWeek}</Text>
              <Divider />
              <Row gutter={16}>
                <Col span={8}>
                  <div>
                    <div className="value" style={{ fontSize: 24, fontWeight: 'bold' }}>¥{optimal.estimatedPrice}</div>
                    <div className="label">机票</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <div className="value" style={{ fontSize: 24 }}>¥{optimal.leaveCost}</div>
                    <div className="label">请假成本</div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <div className="value" style={{ fontSize: 24, color: '#52c41a' }}>¥{optimal.totalCost}</div>
                    <div className="label">总成本</div>
                  </div>
                </Col>
              </Row>
              <Divider />
              <Tag color={optimal.recommendation?.color || 'blue'} style={{ fontSize: 14, padding: '4px 12px' }}>
                {optimal.recommendation?.label || '推荐'} - {optimal.recommendation?.reason || '综合最优'}
              </Tag>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="💰 Top 5 便宜日期" style={{ marginBottom: 16 }}>
            <List
              size="small"
              dataSource={recs?.slice(0, 5) || []}
              renderItem={(item, idx) => (
                <List.Item>
                  <Space>
                    <Text>{idx + 1}.</Text>
                    <Text strong>{item.date}</Text>
                    <Text type="secondary">({item.dayOfWeek})</Text>
                  </Space>
                  <Space>
                    <Text>¥{item.estimatedPrice}</Text>
                    <Tag color={item.recommendation?.color || 'default'}>{item.recommendation?.label || ''}</Tag>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
          
          <Card title="📊 价格分析">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="平均价格" value={analysis?.averagePrice || 0} prefix="¥" />
              </Col>
              <Col span={12}>
                <Statistic title="最低价格" value={analysis?.priceRange?.min || 0} prefix="¥" valueStyle={{ color: '#52c41a' }} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  // 渲染机票查询结果
  const renderFlightResult = () => {
    if (!flightResult) return <Empty description="选择出发地和目的地，查询航班信息" />;
    
    const { leaveCost, dateAnalysis, flights } = flightResult;
    
    return (
      <div>
        <Card style={{ marginBottom: 16, background: '#f0f5ff' }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="请假成本" value={leaveCost.totalCost} prefix="¥" />
            </Col>
            <Col span={8}>
              <Statistic title="最优机票" value={flights?.optimal?.price || 0} prefix="¥" valueStyle={{ color: '#52c41a' }} />
            </Col>
            <Col span={8}>
              <Statistic title="总成本" value={flights?.optimal?.totalCost || 0} prefix="¥" valueStyle={{ fontSize: 24, color: '#1890ff' }} />
            </Col>
          </Row>
        </Card>
        
        <Card title="✈️ 航班列表" style={{ marginBottom: 16 }}>
          {flights?.optimal && (
            <Card size="small" style={{ marginBottom: 12, background: '#f6ffed', borderColor: '#52c41a' }}>
              <Badge.Ribbon text="最优" color="green">
                <Text strong>总成本最低方案</Text>
              </Badge.Ribbon>
            </Card>
          )}
          {flights?.all?.map((flight, idx) => renderFlightDetails(flight, idx))}
        </Card>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="header">
        <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
          ✈️ 旅游规划小助手
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
          智能推荐目的地 · 详细航班信息 · 最优出行日期
        </Text>
      </div>

      <div className="content">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          size="large"
        >
          {/* 行程推荐 */}
          <TabPane tab={<span><EnvironmentOutlined /> 行程推荐</span>} key="recommend">
            <Card title="📍 输入预算和请假信息，获取详细行程推荐">
              <Form form={recommendForm} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={6}>
                    <Form.Item label="总预算（元）" name="budget" rules={[{ required: true, message: '请输入预算' }]}>
                      <InputNumber prefix="¥" min={0} style={{ width: '100%' }} size="large" placeholder="如：5000" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item label="请假天数" name="days" rules={[{ required: true, message: '请输入请假天数' }]}>
                      <InputNumber min={1} max={30} style={{ width: '100%' }} size="large" placeholder="如：3" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item label="出发日期" name="departureDate">
                      <DatePicker 
                        style={{ width: '100%' }} 
                        size="large"
                        placeholder="自动推荐"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item label="返程日期" name="returnDate">
                      <DatePicker 
                        style={{ width: '100%' }} 
                        size="large"
                        placeholder="自动推荐"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="出发地" name="origin" rules={[{ required: true, message: '请选择出发地' }]}>
                      <Select placeholder="选择出发城市" size="large" showSearch>
                        {filteredDestinations.filter(d => d.country === '国内').map(d => (
                          <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="目的地" name="destination">
                      <Select placeholder="不限" size="large" showSearch allowClear>
                        {filteredDestinations.map(d => (
                          <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="选择地区">
                      <Segmented 
                        options={REGIONS} 
                        value={selectedRegion}
                        onChange={setSelectedRegion}
                        size="large"
                        block
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Divider orientation="left">💰 请假成本计算</Divider>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="日薪（元/天）" name="dailySalary" initialValue={500}>
                      <InputNumber prefix="¥" min={0} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="每日工作时长" name="workHours" initialValue={8}>
                      <InputNumber min={1} max={24} style={{ width: '100%' }} size="large" addonAfter="小时" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="请假小时数" name="leaveHours">
                      <InputNumber min={0} step={0.5} style={{ width: '100%' }} size="large" placeholder="自动计算" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />} 
                      size="large" 
                      onClick={handleRecommend}
                      loading={loading}
                      style={{ width: '100%', height: 46 }}
                    >
                      获取详细行程推荐（含航班信息）
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
            
            {error && (
              <Alert message="错误" description={error} type="error" showIcon style={{ marginTop: 16 }} />
            )}
            
            <div style={{ marginTop: 16 }}>
              {loading ? <Spin /> : renderRecommendResult()}
            </div>
          </TabPane>

          {/* 热门榜单 */}
          <TabPane tab={<span><TrophyOutlined /> 热门榜单</span>} key="hot">
            <Card title="🔥 热门目的地排行榜">
              {loading ? <Spin /> : (
                <List
                  dataSource={hotResult?.destinations || []}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge 
                            count={index + 1} 
                            style={{ 
                              backgroundColor: index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#1890ff'
                            }} 
                          />
                        }
                        title={<Text strong>{item.name}</Text>}
                        description={<Space>{item.city} · {item.tags?.join(', ')}</Space>}
                      />
                      <Space>
                        <Tag color="blue">均价 ¥{item.avgPrice}</Tag>
                        <Tag icon={<FireOutlined />} color="orange">{item.popularity}%</Tag>
                      </Space>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </TabPane>

          {/* 日期优化 */}
          <TabPane tab={<span><CalendarOutlined /> 日期优化</span>} key="dates">
            <Card title="📅 选择日期范围，找出最便宜的出行日">
              <Form form={dateForm} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="出发地" name="origin" rules={[{ required: true }]}>
                      <Select placeholder="选择出发城市" size="large" showSearch>
                        {filteredDestinations.map(d => (
                          <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="目的地" name="destination" rules={[{ required: true }]}>
                      <Select placeholder="选择目的地" size="large" showSearch>
                        {filteredDestinations.map(d => (
                          <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="日期范围" name="dateRange" rules={[{ required: true }]}>
                      <RangePicker 
                        style={{ width: '100%' }} 
                        size="large"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="日薪（元/天）" name="dailySalary" initialValue={500}>
                      <InputNumber prefix="¥" style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="请假小时数" name="leaveHours" initialValue={8}>
                      <InputNumber min={0} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Button 
                      type="primary" 
                      icon={<CalculatorOutlined />} 
                      size="large" 
                      onClick={handleDateOptimize}
                      loading={loading}
                      style={{ width: '100%', height: 46 }}
                    >
                      优化出行日期
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
            
            {error && (
              <Alert message="错误" description={error} type="error" showIcon style={{ marginTop: 16 }} />
            )}
            
            <div style={{ marginTop: 16 }}>
              {loading ? <Spin /> : renderDateResult()}
            </div>
          </TabPane>

          {/* 机票查询 */}
          <TabPane tab={<span><DollarOutlined /> 机票查询</span>} key="flights">
            <Card title="✈️ 查询航班详情">
              <Form form={flightForm} layout="vertical">
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="出发地" name="origin" rules={[{ required: true }]}>
                      <Select placeholder="选择出发城市" size="large" showSearch>
                        {filteredDestinations.map(d => (
                          <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="目的地" name="destination" rules={[{ required: true }]}>
                      <Select placeholder="选择目的地" size="large" showSearch>
                        {filteredDestinations.map(d => (
                          <Option key={d.code} value={d.code}>{d.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="日期范围（可选）" name="dateRange">
                      <RangePicker 
                        style={{ width: '100%' }} 
                        size="large"
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <Form.Item label="日薪（元/天）" name="dailySalary" initialValue={500}>
                      <InputNumber prefix="¥" min={0} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="每日工作时长" name="workHours" initialValue={8}>
                      <InputNumber min={1} max={24} style={{ width: '100%' }} size="large" addonAfter="小时" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label="请假小时数" name="leaveHours" initialValue={8}>
                      <InputNumber min={0} step={0.5} style={{ width: '100%' }} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}>
                    <Button 
                      type="primary" 
                      icon={<SearchOutlined />} 
                      size="large" 
                      onClick={handleFlightSearch}
                      loading={loading}
                      style={{ width: '100%', height: 46 }}
                    >
                      查询详细航班信息
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
            
            {error && (
              <Alert message="错误" description={error} type="error" showIcon style={{ marginTop: 16 }} />
            )}
            
            <div style={{ marginTop: 16 }}>
              {loading ? <Spin /> : renderFlightResult()}
            </div>
          </TabPane>
        </Tabs>
      </div>

      <style>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }
        .header {
          padding: 32px;
          text-align: center;
          background: rgba(0,0,0,0.2);
        }
        .content {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
          background: rgba(255,255,255,0.1);
          border: none;
          color: rgba(255,255,255,0.7);
        }
        .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
          background: white;
          color: #1890ff;
        }
        .ant-card {
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }
        .price-item .value {
          font-size: 24px;
          font-weight: bold;
        }
        .price-item .label {
          color: #888;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}

export default App;
